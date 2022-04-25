<template>
  <div class="comp-wrapper">
    <div class="header-wrapper">
      <div class="header-item" v-for="item in headerMap.keys()" :key="item" @click="changeTypeHandle(item)" :class="[activeType === item ? 'active-header' : '']">
        <div class="item-title">{{ headerMap.get(item) }}</div>
        <div class="item-bar"></div>
      </div>
    </div>
    <div class="container-wrapper">
      <comp-upper-table v-if="activeType === 0"></comp-upper-table>
      <comp-lower-table v-if="activeType === 1"></comp-lower-table>
      <comp-approve-table v-if="activeType === 2"></comp-approve-table>
      <comp-reject-table v-if="activeType === 3"></comp-reject-table>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import CompUpperTable from '@/views/modules/comp/comp-upperp-table.vue'
import CompLowerTable from '@/views/modules/comp/comp-lower-table.vue'
import CompApproveTable from '@/views/modules/comp/comp-approve-table.vue'
import CompRejectTable from '@/views/modules/comp/comp-reject-table.vue'

export default {
  name: 'comp-list',
  components: { CompRejectTable, CompApproveTable, CompLowerTable, CompUpperTable },
  setup() {
    const headerMap = new Map([
      [0, '已上架'],
      [1, '已下架'],
      [2, '审批中'],
      [3, '被驳回']
    ])
    const activeType = ref(0)

    const changeTypeHandle = (compType) => {
      if (compType !== activeType.value) {
        activeType.value = compType
      }
    }
    return {
      headerMap,
      activeType,

      changeTypeHandle
    }
  }
}
</script>

<style scoped lang="scss">
.comp-wrapper {
  border-radius: 8px;
  background-color: #ffffff;

  .header-wrapper {
    display: flex;
    height: 59px;
    padding: 0 24px;
    cursor: pointer;
    border-bottom: 1px solid rgba(238, 238, 238, 1);
    font-family: PingFangSC-Medium;

    .header-item {
      height: 57px;
      line-height: 57px;
      margin-right: 42px;
      font-size: 14px;
      color: rgba(102, 102, 102, 1);
      font-weight: 500;
    }

    .active-header {
      color: rgba(20, 146, 255, 1);

      .item-bar {
        height: 2px;
        background: #1492FF;
        border-radius: 1px;
      }
    }
  }

  .container-wrapper {
    height: calc(100vh - 168px);
  }
}
</style>
