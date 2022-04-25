import { computed } from 'vue'
import store from '@/store'
import { createRouter, createWebHistory } from 'vue-router'
import { ssoLoginByTokenApi } from '@/api/login-api'
import config from '@/utils/config'
import cloneDeep from 'lodash/cloneDeep'

const commonModules = import.meta.glob('../views/common/*.vue')
const layoutModules = import.meta.glob('../views/layout/*.vue')
const dynamicModules = import.meta.glob('../views/modules/*/*.vue')

const activeRouteComputed = computed({
  get: () => store.state.common.activeRoute,
  set: value => {
    store.commit('common/updateActiveRoute', value)
  }
})

const authorityRouteListComputed = computed({
  get: () => {
    const tempList = store.state.user.authorityRouteList
    return tempList.length ? tempList : JSON.parse(sessionStorage.getItem('authorityRouteList'))
  }
})

const mainRoutes = {
  path: '/',
  component: layoutModules['../views/layout/main.vue'],
  name: 'main-dynamic',
  meta: { title: '主入口整体布局' }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [mainRoutes],
  scrollBehavior: () => ({ top: 0 })
})

export const addDynamicMenuRoutes = (routeList = []) => {
  routeList.forEach((item) => {
    const route = {
      name: [...new Set(item.path.replace('/', '').replaceAll('/', '-').split('-'))].join('-'),
      path: item.path,
      component: undefined,
      meta: Object.assign(item.meta, { id: item.id, isDynamicRoute: true }),
      props: route => route.query
    }
    const tempComp = dynamicModules[`../views/modules${ item.path }.vue`]
    route.component = tempComp ? tempComp : commonModules['../views/common/404.vue']
    router.addRoute('main-dynamic', route)
  })
}

const theFirstRouteJump = (to, from, next) => {
  addDynamicMenuRoutes(cloneDeep(authorityRouteListComputed.value))
  store.commit('user/updateUserStore')
  // 当账号切换时，由于权限的不同可能导致当前角色没有对应的路由权限，默认跳转到第一个有权限的路由地址
  if (router.hasRoute([...new Set(to.path.replace('/', '').replaceAll('/', '-').split('-'))].join('-'))) {
    if (to.query.access_token) {
      delete to.query.access_token
    }
    next({...to, replace: true})
  } else {
    next({ name: router.getRoutes()[0].name, replace: true })
  }
  activeRouteComputed.value = to
}

router.beforeEach((to, from, next) => {
  const { access_token: token, userType = '1' } = to.query
  if (token) {
    sessionStorage.setItem('token', token.toString())
    ssoLoginByTokenApi({ accessToken: token, userType }).then(({ data }) => {
      const { uid, username, mobilephone } = data
      store.commit('user/updateUserInfo', {
        userId: uid,
        userName: username,
        userPhone: mobilephone,
        userData: data
      })
      sessionStorage.setItem('userId', uid)
      sessionStorage.setItem('userName', username)
      sessionStorage.setItem('userPhone', mobilephone)
      sessionStorage.setItem('userData', JSON.stringify(data))
      // 登录成功后拿到用户的角色信息、部门信息（后面的接口需要对应的部门信息）
      store.dispatch('user/initRoleListDataAction', uid).then((isSuccess) => {
        if (isSuccess) {
          theFirstRouteJump(to, from, next)
        }
      })
    }).catch(() => {
      sessionStorage.removeItem('token')
    })
  } else {
    if (sessionStorage.getItem('token')) {
      if (to.meta.isDynamicRoute) {
        next()
      } else {
        theFirstRouteJump(to, from, next)
      }
      activeRouteComputed.value = to
    } else {
      window.location.href = `${ config.unifiedLoginUrl }/login?clientId=${ config.clientId }&redirect_uri=${ config.redirectUrl }`
    }
  }
})

export default router
