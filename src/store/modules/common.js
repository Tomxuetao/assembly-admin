export default {
  namespaced: true,
  state: {
    menuList: [],
    // 激活的route
    activeRoute: {},
    // 侧边栏, 折叠状态
    sidebarFold: false,
    // 内容, 是否需要刷新
    contentIsNeedRefresh: false,
    // 页面文档可视高度(随窗口改变大小)
    documentClientHeight: 0
  },
  mutations: {
    updateMenuList(state, list) {
      state.menuList = list
    },
    updateActiveRoute(state, activeRoute) {
      state.activeRoute = activeRoute
    },
    updateSidebarFold(state, fold) {
      state.sidebarFold = fold
    },
    updateContentIsNeedRefresh(state, status) {
      state.contentIsNeedRefresh = status
    },
    updateDocumentClientHeight(state, height) {
      state.documentClientHeight = height
    }
  }
}
