<template>
  <div class="interface-wrapper">
    <second-title title="接口服务" :show-block="true" :show-border="false"></second-title>
    <div class="table-wrapper">
      <el-table :data="dataList">
        <el-table-column label="接口名称" prop="interfaceName"></el-table-column>
        <el-table-column label="接口类型" prop="interfaceType">
          <template #default="scope">{{ interfaceTypeMap.get(scope.row.interfaceType) }}</template>
        </el-table-column>
        <el-table-column label="接口描述" prop="remark"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getCompInterfaceListApi } from '@/api/comp-api'
import { ref } from 'vue'
export default {
  name: 'interface-detail',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const dataList = ref([])
    const getDataListHandle = () => {
      getCompInterfaceListApi({ serviceId: props.id}).then(({ data }) => {
        dataList.value = data
      })
    }
    getDataListHandle()

    const interfaceTypeMap = new Map([
      [0, 'API'],
      [1, 'SPI'],
      [2, 'SDK']
    ])

    return {
      dataList,
      interfaceTypeMap
    }
  }
}
</script>

<style scoped lang="scss">
.interface-wrapper {
  .table-wrapper {
    padding: 0 24px;
  }
}
</style>
