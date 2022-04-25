import { createStore } from 'vuex'

import user from './modules/user'
import common from './modules/common'
import comp from './modules/comp'

const store = createStore({
  strict: import.meta.env.MODE !== 'production',
  modules: {
    user,
    comp,
    common
  }
})

export default store
