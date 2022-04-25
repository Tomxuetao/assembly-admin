<template>
  <div class="site-wrapper" :class="{ 'site-sidebar--fold': sidebarFold }">
    <main-navbar></main-navbar>
    <main-sidebar></main-sidebar>
    <div class="site-content__wrapper" :style="{ 'min-height': documentClientHeight + 'px' }">
      <main-content v-if="!contentIsNeedRefresh"></main-content>
    </div>
  </div>
</template>

<script>
import MainNavbar from './main-navbar.vue'
import MainSidebar from './main-sidebar.vue'
import MainContent from './main-content.vue'
import { useStore } from 'vuex'
import { computed, provide, nextTick, onMounted } from 'vue'
export default {
  name: 'main-index',
  components: { MainNavbar, MainSidebar, MainContent },
  setup() {
    const store = useStore()

    // computed
    const userId = computed({
      get: () => {
        return store.state.user.id
      },
      set: value => {
        store.commit('user/updateId', value)
      }
    })

    const userName = computed({
      get: () => {
        return store.state.user.name
      },
      set: value => {
        store.commit('user/updateName', value)
      }
    })

    const sidebarFold = computed(() => {
      return store.state.common.sidebarFold
    })

    const documentClientHeight = computed({
      get: () => {
        return store.state.common.documentClientHeight
      },
      set: value => {
        store.commit('common/updateDocumentClientHeight', value)
      }
    })


    const resetDocumentClientHeight = () => {
      documentClientHeight.value = document.documentElement.clientHeight
      window.onresize = () => {
        documentClientHeight.value = document.documentElement.clientHeight
      }
    }

    const contentIsNeedRefresh = computed({
      get: () => {
        return store.state.common.contentIsNeedRefresh
      },
      set: value => {
        store.commit('common/updateContentIsNeedRefresh', value)
      }
    })

    provide('refreshHandle', () => {
      store.commit('common/updateContentIsNeedRefresh', true)
      nextTick(() => {
        store.commit('common/updateContentIsNeedRefresh', false)
      })
    })

    onMounted(() => {
      resetDocumentClientHeight()
    })

    return {
      userId,
      userName,
      sidebarFold,
      documentClientHeight,
      contentIsNeedRefresh
    }
  }
}
</script>

<style scoped>

</style>
