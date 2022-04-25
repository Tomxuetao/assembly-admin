import { createApp } from 'vue'
import ElementUI from 'element-plus'

import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import { isAuth } from '@/utils'

import 'element-plus/theme-chalk/src/index.scss'
import 'normalize.css/normalize.css'
import '@/assets/scss/index.scss'
import '@/assets/font/index.css'

import ElIcons from '@/icons/el-icons'
import CustomComp from '@/components/index'

import 'default-passive-events'

const app = createApp(App)
app.config.globalProperties.$isAuth = isAuth
app.use(store).use(router).use(ElementUI).use(ElIcons).use(CustomComp).mount('#app')
