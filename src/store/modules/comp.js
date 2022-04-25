export default {
  namespaced: true,

  state: {
    allAppList: [],
    industryLabelList: [],
    serviceLabelList: []
  },

  mutations: {
    updateAllAppList(state, list) {
      state.allAppList = list
    },

    updateIndustryLabelList(state, list) {
      state.industryLabelList = list
    },

    updateServiceLabelList(state, list) {
      state.serviceLabelList = list
    }
  }
}
