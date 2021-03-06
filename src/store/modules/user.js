import { getUserResourcesApi } from '@/api/login-api'

export default {
  namespaced: true,
  state: {
    userId: '',
    roleId: '',
    userName: '',
    userData: {},
    userPhone: '',
    accountNum: '',
    accountName: '',
    userAuthMap: new Map(),
    userOrgList: [],
    authorityCodeList: [],
    authorityMenuList: [],
    authorityRouteList: []
  },

  mutations: {
    updateUserId(state, value) {
      state.userId = value
    },

    updateRoleId(state, value) {
      state.roleId = value
    },

    updateUserName(state, value) {
      state.userName = value
    },

    updateUserData(state, value) {
      state.userData = value
    },

    updateUserPhone(state, value) {
      state.userPhone = value
    },

    updateAccountNum(state, value) {
      state.accountNum = value
    },

    updateAccountName(state, value) {
      state.accountName = value
    },

    updateUserAuthMap(state, value) {
      state.userAuthMap = value
    },

    updateUserOrgList(state, value) {
      state.userOrgList = value
    },

    updateAuthorityCodeList(state, value){
      state.authorityCodeList = value
    },

    updateAuthorityMenuList(state, value){
      state.authorityMenuList = value
    },

    updateAuthorityRouteList(state, value){
      state.authorityRouteList = value
    },


    updateUserInfo(state, value) {
      const { userId, userName, userPhone, userData } = value
      state.userId = userId
      state.userName = userName
      state.userPhone = userPhone
      state.userData = userData
    },

    updateUserStore(state) {
      state.roleId = sessionStorage.getItem('roleId')
      state.userId = sessionStorage.getItem('userId')
      state.userName = sessionStorage.getItem('userName')
      state.userPhone = sessionStorage.getItem('userPhone')
      state.userData = JSON.parse(sessionStorage.getItem('userData'))
      state.userOrgList = JSON.parse(sessionStorage.getItem('userOrgList'))
      state.accountNum = sessionStorage.getItem('accountNum')
      state.accountName = sessionStorage.getItem('accountName')
      state.authorityCodeList = JSON.parse(sessionStorage.getItem('authorityCodeList'))
      state.authorityMenuList = JSON.parse(sessionStorage.getItem('authorityMenuList'))
      state.authorityRouteList = JSON.parse(sessionStorage.getItem('authorityRouteList'))
    }
  },

  actions: {

    /**
     * ?????????????????????
     * @param context
     * @param userId
     */
    initRoleListDataAction(context, userId) {
      return new Promise((resolve, reject) => {
        getUserResourcesApi({ userId }).then(({ data }) => {
          const { roleResourceInfoMap: userAuthMap, userResourceRoleInfos: userOrgList } = data
          sessionStorage.setItem('userAuthMap', JSON.stringify(userAuthMap))
          const tempUserAuthMap = new Map()
          Object.keys(userAuthMap).map((item) => tempUserAuthMap.set(Number(item), userAuthMap[item]))
          context.commit('updateUserAuthMap', tempUserAuthMap)
          if (Array.isArray(userOrgList) && userOrgList.length) {
            context.commit('updateUserOrgList', userOrgList)
            sessionStorage.setItem('userOrgList', JSON.stringify(userOrgList))
            const { accountNum, roleResources } = userOrgList[0]
            setCurAuthorityHandle(accountNum, roleResources[0].roleId, userOrgList, tempUserAuthMap)
            context.commit('updateUserStore')
            resolve(true)
          }
          reject(new Error('??????????????????????????????'))
        }).catch(() => {
          reject(new Error('??????????????????????????????'))
        })
      })
    }
  }
}

export const setCurAuthorityHandle = (accountNum, roleId, userOrgList, userAuthMap = new Map()) => {
  // ??????????????????????????????????????????
  const userCurDept = userOrgList.find((item) => item.accountNum === accountNum)
  // ??????????????????????????????????????????????????????
  const { accountName } = userCurDept || { accountName: '' }
  sessionStorage.setItem('roleId', roleId)
  sessionStorage.setItem('accountNum', accountNum)
  sessionStorage.setItem('accountName', accountName)
  // ???????????????????????????????????????
  const userCurAuthList = userAuthMap.get(Number(roleId))

  const tempAuthorityCodeList = []
  const tempAuthorityMenuList = []
  const tempAuthorityRouteList = []
  userCurAuthList.forEach((item) => {
    const tempMeta = JSON.parse(item.meta)
    item.meta = tempMeta
    item.pName = tempMeta.pName
    tempAuthorityCodeList.push(item.resourceCode)
    if (item.systemType === 2) {
      if (item.meta.isMenu) {
        tempAuthorityMenuList.push(item)
      }
      if (item.path) {
        tempAuthorityRouteList.push(item)
      }
    }
  })
  const tempCodeList = [...new Set(tempAuthorityCodeList)]
  sessionStorage.setItem('authorityCodeList', JSON.stringify(tempCodeList))
  sessionStorage.setItem('authorityMenuList', JSON.stringify(tempAuthorityMenuList))
  sessionStorage.setItem('authorityRouteList', JSON.stringify(tempAuthorityRouteList))

  return {
    roleId,
    accountNum,
    accountName,
    authorityCodeList: tempCodeList,
    authorityMenuList: tempAuthorityMenuList,
    authorityRouteList: tempAuthorityRouteList
  }
}
