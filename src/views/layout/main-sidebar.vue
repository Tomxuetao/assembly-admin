<template>
  <aside class="site-sidebar site-sidebar--dark">
    <div class="site-sidebar__inner">
      <el-menu
        :default-active="activeRouteComputed.meta.isMenu ? activeRouteComputed.meta.id + '' : activeRouteComputed.meta.pid  + '' || '0'"
        :collapse="sidebarFold"
        :collapse-transition="false"
        :unique-opened="true"
        class="site-sidebar__menu">
        <sub-menu v-for="item in menuListComputed" :key="item.id" :menuData="item"></sub-menu>
      </el-menu>
    </div>
    <div class="site-sidebar__footer" @click="sidebarFold = !sidebarFold">
      <icon-svg name="fold" class="icon-svg"></icon-svg>
    </div>
  </aside>
</template>

<script>
import SubMenu from './main-sidebar-sub-menu.vue'

import { useStore } from 'vuex'
import { computed } from 'vue'
import { treeDataTranslate } from '@/utils'
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'main-sidebar',
  components: { SubMenu },
  setup () {
    const store = useStore()

    const sidebarFold = computed({
      get: () => {
        return store.state.common.sidebarFold
      },
      set: (value) => {
        store.commit('common/updateSidebarFold', value)
      }
    })

    const authorityMenuListComputed = computed({
      get: () => {
        return store.state.user.authorityMenuList || JSON.parse(sessionStorage.getItem('authorityMenuList'))
      }
    })

    const menuListComputed = computed({
      get: () => {
        return treeDataTranslate(cloneDeep(authorityMenuListComputed.value || []), 'id', 'pid').sort((a, b) => a.sort - b.sort)
      }
    })

    const activeRouteComputed = computed({
      get: () => store.state.common.activeRoute
    })

    return {
      sidebarFold,
      menuListComputed,
      activeRouteComputed
    }
  }
}
</script>

<style scoped>

</style>
