<template>
  <nav class="site-navbar site-navbar--default">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand">
        <div v-if="!sidebarFold" class="site-navbar__brand-lg">
          <div class="brand-logo"></div>
          <div class="brand-title">组件管理中心后台</div>
        </div>
        <div v-else class="site-navbar__brand-mini">
          <div class="brand-logo"></div>
        </div>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <div class="site-navbar__menu">
        <div class="site-navbar__switch">
          <div class="goto-back" @click="gotoBackHandle()">
            <icon-svg name="left" class="icon-svg"></icon-svg>
          </div>
          <div class="goto-route">{{ activeRouteComputed.meta.title }}</div>
        </div>
      </div>
      <div class="site-navbar__menu site-navbar__menu--right">
        <div class="site-navbar__avatar">
          <el-dropdown trigger="click">
            <div class="item-badge">
              <div class="user-name">{{ userNameShortComputed }}</div>
            </div>
            <template #dropdown>
              <el-dropdown-menu style="min-width: 130px;">
                <el-dropdown-item>
                  <div style="height: 62px;">
                    <div style="font-size: 14px; color: rgba(51, 51, 51, 1); line-height: 14px; padding: 8px 0 12px 0">{{ userNameComputed }}</div>
                    <div style="font-size: 12px; color: rgba(153, 153, 153, 1); line-height: 18px;">{{ accountNameComputed }}</div>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item @click="showChangeDialogHandle()" divided>切换账号</el-dropdown-item>
                <el-dropdown-item @click="logoutHandle()">退出系统</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </nav>
  <el-dialog title="切换账号" v-model="dialogFormVisible" width="25%">
    <el-form :model="dataForm" :rules="dataRules" label-position="left" label-width="50px" style="padding: 24px;">
      <el-form-item label="账号" prop="accountNum">
        <el-select v-model="dataForm.accountNum" @change="selectChangeHandle" placeholder="请选择" style="width: 100%">
          <el-option v-for="item in userOrgListComputed" :key="item.accountNum" :label="item.accountName" :value="item.accountNum"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select v-model="dataForm.roleId" placeholder="请选择" style="width: 100%">
          <el-option v-for="item in selectedRoleList" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="default">取消</el-button>
        <el-button type="primary" @click="changeHandle" size="default">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { computed, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'

import config from '@/utils/config'
import { ssoLogoutApi } from '@/api/login-api'
import { setCurAuthorityHandle } from '@/store/modules/user'

export default {
  name: 'main-navbar',
  setup() {
    const store = useStore()
    const router = useRouter()

    const sidebarFold = computed({
      get: () => {
        return store.state.common.sidebarFold
      },
      set: value => {
        store.commit('common/updateSidebarFold', value)
      }
    })

    const userNameComputed = computed({
      get: () => store.state.user.userName || sessionStorage.getItem('userName')
    })

    const userOrgListComputed = computed({
      get: () => store.state.user.userOrgList || JSON.parse(sessionStorage.getItem('userOrgList'))
    })

    const accountNameComputed = computed({
      get: () => store.state.user.accountName || sessionStorage.getItem('accountName')
    })

    const userNameShortComputed = computed({
      get: () => {
        const userName = store.state.user.userName || sessionStorage.getItem('userName')
        return (userName || '').substring(userNameComputed.value.length - 2)
      }
    })

    const activeRouteComputed = computed({
      get: () => store.state.common.activeRoute
    })

    const userAuthMapComputed = computed({
      get: () => {
        const tempUserAuthMap = new Map() || store.state.user.userAuthMap
        if (!tempUserAuthMap.size) {
          const tempAuthMap = JSON.parse(sessionStorage.getItem('userAuthMap'))
          Object.keys(tempAuthMap).map((item) => tempUserAuthMap.set(Number(item), tempAuthMap[item]))
        }
        return tempUserAuthMap
      }
    })

    /**
     * 切换账号
     */
    const changeHandle = () => {
      if (dataForm.roleId !== Number(sessionStorage.getItem('roleId')) || dataForm.accountNum !== sessionStorage.getItem('accountNum')) {
        setCurAuthorityHandle(dataForm.accountNum, dataForm.roleId, userOrgListComputed.value, userAuthMapComputed.value)
        window.location.reload()
      }
      dialogFormVisible.value = false
    }

    /**
     * 退出系统
     */
    const logoutHandle = () => {
      ElMessageBox.confirm('确认退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ssoLogoutApi({ accessToken: sessionStorage.getItem('token') }).then(() => {
          sessionStorage.clear()
          sessionStorage.clear()
          window.location.href = `${ config.unifiedLoginUrl }/login?clientId=${ config.clientId }&redirect_uri=${ config.redirectUrl }`
        })
      })
    }
    const dialogFormVisible = ref(false)
    const dataForm = reactive({
      accountNum: sessionStorage.getItem('accountNum'),
      roleId: Number(sessionStorage.getItem('roleId'))
    })

    const dataRules = reactive({
      accountNum: [{ required: true, message: '不能为空', trigger: 'change' }],
      roleId: [{ required: true, message: '不能为空', trigger: 'change' }]
    })

    const selectedRoleList = ref([])
    const selectChangeHandle = (value) => {
      const tempRoles = userOrgListComputed.value.find((item) => item.accountNum === value)
      if (tempRoles) {
        selectedRoleList.value = tempRoles.roleResources
        dataForm.roleId = tempRoles.roleResources[0].roleId
      }
    }
    selectChangeHandle(dataForm.accountNum)

    watch(userOrgListComputed, () => {
      const tempRoles = userOrgListComputed.value.find((item) => item.accountNum === dataForm.accountNum)
      if (tempRoles) {
        selectedRoleList.value = tempRoles.roleResources
      }
    })

    const showChangeDialogHandle = () => {
      dataForm.accountNum =  sessionStorage.getItem('accountNum')
      dataForm.roleId = Number(sessionStorage.getItem('roleId'))
      dialogFormVisible.value = true
    }

    const gotoBackHandle = () => {
      router.back()
    }

    return {
      dataForm,
      dataRules,
      sidebarFold,
      selectedRoleList,
      userNameComputed,
      dialogFormVisible,
      userOrgListComputed,
      accountNameComputed,
      activeRouteComputed,
      userNameShortComputed,

      changeHandle,
      logoutHandle,
      gotoBackHandle,
      selectChangeHandle,
      showChangeDialogHandle
    }
  }
}
</script>

<style scoped lang="scss">
.site-navbar__brand-lg, .site-navbar__brand-mini {
  display: flex;
  justify-content: center;
  align-items: center;

  .brand-logo {
    height: 24px;
    width: 24px;
    background-size: cover;
    background-image: url("@/assets/img/img-logo.png");
  }

  .brand-title {
    line-height: 24px;
    margin-left: 12px;
    font-weight: 600;
    font-family: PingFangSC-Semibold;
  }
}

.site-navbar__switch {
  display: flex;
  justify-content: center;
  align-items: center;

  .goto-back {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 12px;

    .icon-svg {
      color: rgba(51, 51, 51, 1);
      font-size: 20px;
    }
  }

  .goto-back:hover {
    background-color: rgba(240, 246, 250, 1);
  }

  .goto-back:active {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .goto-route {
    margin-left: 16px;
    color: rgba(51, 51, 51, 1);
    font-weight: 600;
    font-family: PingFangSC-Semibold;
  }
}

.site-navbar__avatar {
  .item-badge {
    display: flex;
    position: relative;
    padding: 10px;

    .user-name {
      width: 40px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 12px;
      color: rgba(77, 135, 255, 1);
      background-color: rgba(240, 246, 250, 1);
      font-family: PingFangSC-Semibold;
    }
  }
}
</style>
