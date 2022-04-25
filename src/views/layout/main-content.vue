<template>
  <main class="site-content" :style="siteContentViewHeight">
    <router-view></router-view>
  </main>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'main-content',
  setup() {
    const store = useStore()
    const documentClientHeight = computed({
      get: () => {
        return store.state.common.documentClientHeight
      }
    })

    const siteContentViewHeight = computed({
      get: () => {
        let height = documentClientHeight.value > 768 ? documentClientHeight.value - 60 : 768 - 60
        return `height: ${height}px`
      }
    })

    return {
      siteContentViewHeight
    }
  }
}
</script>
