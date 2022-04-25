<template>
  <div class="interface-wrapper">
    <second-title title="接口服务" :show-block="true" :show-border="false"></second-title>
    <div class="table-wrapper">
      <el-table :data="dataList">
        <el-table-column label="接口名称" prop="interfaceName"></el-table-column>
        <el-table-column label="接口类型" prop="interfaceType">
          <template #default="scope">
            {{ interfaceTypeMap.get(scope.row.interfaceType) }}
          </template>
        </el-table-column>
        <el-table-column label="接口描述" prop="remark"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column label="测试结果" prop="testStatus">
          <template #default="scope">
            {{ scope.row.interfaceType === 1 ? 'SPI无需测试' : scope.row.testStatus === 1 ? '测试通过' : '尚未通过测试' }}
          </template>
        </el-table-column>
        <template v-if="activeStep !==3">
          <el-table-column label="操作" align="center" width="120" >
            <template #default="scope">
              <el-button @click="debuggerInterfaceHandle(scope.row.id)" :disabled="scope.row.interfaceType === 1" size="small" type="text">测试</el-button>
              <el-button @click="addOrUpdateHandle(scope.row, true)" size="small" type="text">修改</el-button>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <template v-if="activeStep !==3">
        <div style="display: flex; justify-content: center; padding: 12px 0;">
          <el-button @click="addOrUpdateHandle()" :disabled="!compId" type="text">
            <el-icon><plus></plus></el-icon>
            新增接口
          </el-button>
        </div>
      </template>
    </div>
    <interface-add-or-update ref="interfaceAddOrUpdateRef" @updateList="updateListHandle"></interface-add-or-update>
    <interface-debugger-dialog ref="interfaceDebuggerDialogRef" @updateStatus="updateStatusHandle"></interface-debugger-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import { getCompInterfaceListApi } from '@/api/comp-api'
import InterfaceAddOrUpdate from '@/views/modules/release/interface-add-or-update.vue'
import InterfaceDebuggerDialog from '@/views/modules/release/interface-debugger-dialog.vue'
export default {
  name: 'interface-form',
  components: { InterfaceDebuggerDialog, InterfaceAddOrUpdate },
  props: {
    compId: {
      required: true
    },
    activeStep: {
      required: true,
      type: Number
    },
    isCreate: {
      required: true,
      type: Boolean
    }
  },
  setup(props) {
    const interfaceTypeMap = new Map([
      [0, 'API'],
      [1, 'SPI']
    ])
    const interfaceAddOrUpdateRef = ref()
    const addOrUpdateHandle = (data = { serviceId: props.compId }, isUpdate = false) => {
      interfaceAddOrUpdateRef.value.initDialogHandle(data, isUpdate)
    }

    const interfaceDebuggerDialogRef = ref()
    const debuggerInterfaceHandle = (id) => {
      interfaceDebuggerDialogRef.value.initDialogHandle(id)
    }

    const dataList = ref([])
    const updateListHandle = () => {
      getCompInterfaceListApi({ serviceId: props.compId }).then(({ data }) => {
        dataList.value = data
      })
    }

    const updateStatusHandle = (status, id) => {
      const temp = dataList.value.find((item) => item.id === id)
      if (temp) {
        temp.testStatus = status
      }
    }

    // 外部调用获判断所有API接口是否都通过测试
    const validateHandle = () => {
      const tempList = dataList.value.filter((item) => item.interfaceType === 0)
      if (tempList.length) {
        return !tempList.find((item) => !item.testStatus)
      } else {
        return false
      }
    }

    const getDataListHandle = () => {
      if (!props.isCreate) {
        updateListHandle()
      }
    }

    getDataListHandle()
    return {
      dataList,
      interfaceTypeMap,
      interfaceAddOrUpdateRef,
      interfaceDebuggerDialogRef,

      validateHandle,
      updateListHandle,
      addOrUpdateHandle,
      updateStatusHandle,
      debuggerInterfaceHandle
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
