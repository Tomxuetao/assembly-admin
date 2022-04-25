<template>
  <div class="detail-wrapper">
    <basic-detail v-if="Object.keys(detailData).length" :detail-data="detailData"></basic-detail>
    <template v-if="['0', '1'].includes(status)">
      <auth-detail :list="authList"></auth-detail>
      <interface-detail v-if="id" :id="id"></interface-detail>
    </template>
    <template v-else>
      <approve-detail></approve-detail>
    </template>
  </div>
</template>

<script>
import { getCompDetailApi } from '@/api/comp-api'
import { reactive, ref } from 'vue'
import BasicDetail from '@/views/modules/comp/basic-detail.vue'
import AuthDetail from '@/views/modules/comp/auth-detail.vue'
import InterfaceDetail from '@/views/modules/comp/interface-detail.vue'
import ApproveDetail from '@/views/modules/comp/approve-detail.vue'
export default {
  name: 'comp-detail',
  components: { ApproveDetail, InterfaceDetail, AuthDetail, BasicDetail },
  props: {
    id: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    }
  },
  setup(props) {
    let detailData = reactive({})
    const authList = ref([])
    const getDetailHandle = () => {
      getCompDetailApi(props.id, props.status).then(({ data }) => {
        if (['0', '1'].includes(props.status)) {
          const { serviceAuthorizationInformation: list } = data
          authList.value = list
          detailData = Object.assign(detailData, data)
        } else {
          const { serviceInfo } = data
          detailData = Object.assign(detailData, serviceInfo)
        }
      })
    }

    getDetailHandle()

    return {
      authList,
      detailData
    }
  }
}
</script>

<style scoped lang="scss">
.detail-wrapper {
  height: calc(100vh - 108px);
  border-radius: 8px;
  background-color: #ffffff;
  overflow-y: auto;
}
</style>
