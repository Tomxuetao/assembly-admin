<template>
  <el-dialog v-model="dialogFormVisible" :before-close="(done) => showOrCloseDialogHandle(done)" title="接口调试" width="60%" custom-class="custom-dialog" top="10vh">
    <second-title title="基础信息" :show-block="true" :show-border="false" style="margin: -24px 0 0 -24px"></second-title>
    <el-form :model="dataForm" label-position="left" label-width="120px" class="custom-form">
      <el-row :gutter="48">
        <el-col :span="12">
          <el-form-item label="测试地址">{{ dataForm.testTargetAddress }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生产地址">{{ dataForm.productionTargetAddress }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="接入协议">{{ dataForm.agreementRequestMethod === 0 ? 'HTTP' : 'HTTPS' }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请求方式">{{ requestMethodMap.get(dataForm.requestMethod) }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请求征文格式">{{ dataForm.requestContentType }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请求编码">{{ dataForm.requestCode }}</el-form-item>
        </el-col>
      </el-row>
      <second-title title="参数配置" :show-block="true" :show-border="false" style="margin: 0 0 0 -24px"></second-title>
      <el-table :data="dataList">
        <el-table-column label="配置类型" prop="type">
          <template #default="scope">{{ configTypeMap.get(scope.row.type) }}</template>
        </el-table-column>
        <el-table-column label="参数名称" prop="paramName"></el-table-column>
        <el-table-column label="参数值" prop="paramValue">
          <template #default="scope">
            <el-input v-model="scope.row.paramValue" placeholder="请输入参数值"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="参数类型" prop="paramType">
          <template #default="scope">
            {{ paramTypeMap.get(scope.row.paramType) }}
          </template>
        </el-table-column>
        <el-table-column label="参数描述" prop="paramDesc"></el-table-column>
      </el-table>
    </el-form>
    <second-title title="响应信息" :show-block="true" :show-border="false" style="margin: 0 0 0 -24px"></second-title>
    <code>
      <pre>{{ responseData ? JSON.parse(responseData) : '' }}</pre>
    </code>
    <template #footer>
      <el-button @click="showOrCloseDialogHandle()" style="width: 116px">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="debuggerInterfaceHandle" style="width: 116px">测试</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, ref } from 'vue'
import { getInterfaceDetailApi, debugInterfaceApi } from '@/api/comp-api'
import { ElMessage } from 'element-plus'

export default {
  name: 'interface-debugger-dialog',
  emits: ['update-status'],
  setup(props, { emit }) {
    let dataForm = reactive({
      id: undefined,
      serviceId: undefined,
      agreementRequestMethod: undefined,
      interfaceName: undefined,
      interfaceParameter: [],
      interfaceType: undefined,
      remark: undefined,
      requestCode: undefined,
      requestContentType: undefined,
      requestMethod: undefined,
      returnToExample: undefined,
      testTargetAddress: undefined,
      productionTargetAddress: undefined
    })
    const dataList = ref([])

    const configTypeMap = new Map([
      [3, 'Headers'],
      [0, '接口入参'],
      [1, '接口出参'],
      [2, '错误码']
    ])

    const requestMethodMap = new Map([
      [0, 'GET'],
      [1, 'POST']
    ])

    const paramTypeMap = new Map([[0, '字符串'], [1, '数字'], [2, '日期'], [3, '文件']])

    const serviceId = ref()
    const initDialogHandle = (id) => {
      serviceId.value = id
      getInterfaceDetailApi({ id }).then(({ data }) => {
        dialogFormVisible.value = true
        dataForm = Object.assign(dataForm, data)
        dataList.value = dataForm.interfaceParameter.map((item) => { return {...item, paramValue: undefined}}) || []
      })
    }

    let responseData = ref('{}')
    const dialogFormVisible = ref(false)
    const showOrCloseDialogHandle = (done = null) => {
      dialogFormVisible.value = !dialogFormVisible.value
      if (done) {
        done()
      }
      responseData.value = '{}'
      submitLoading.value = false
    }

    const submitLoading = ref(false)
    const debuggerInterfaceHandle = () => {
      const tempParam = {}
      const paramValueArray = []
      if (dataList.value.length) {
        dataList.value.forEach((item) => {
          paramValueArray.push(item.paramValue)
          tempParam[item.paramName] = item.paramValue
        })
      }
      if (paramValueArray.length >= 0 && !paramValueArray.includes(undefined)) {
        submitLoading.value = true
        const tempForm = {
          param: tempParam,
          address: dataForm.testTargetAddress,
          serviceId: serviceId.value,
          requestMethod: requestMethodMap.get(dataForm.requestMethod),
          requestContentType: dataForm.requestContentType
        }
        debugInterfaceApi(tempForm).then(({ code, data, message }) => {
          submitLoading.value = false
          if (code === 200) {
            emit('update-status', 1, serviceId.value)
          } else {
            if (data) {
              try {
                responseData.value = JSON.stringify(JSON.parse(data))
                emit('update-status', 1, serviceId.value)
              } catch (e) {
                ElMessage.error(data)
                emit('update-status', 0, serviceId.value)
              }
            } else {
              emit('update-status', 0, serviceId.value)
              ElMessage.error(message)
            }
          }
        }).catch(() => {
          submitLoading.value = false
        })
      } else {
        ElMessage.warning('请填写完整的参数值')
      }
    }

    return {
      dataForm,
      dataList,
      responseData,
      paramTypeMap,
      configTypeMap,
      submitLoading,
      requestMethodMap,
      dialogFormVisible,

      initDialogHandle,
      debuggerInterfaceHandle,
      showOrCloseDialogHandle
    }
  }
}
</script>

<style lang="scss">
.custom-dialog {
  .el-dialog__body {
    height: 690px;
    overflow-y: auto;
  }
}
</style>
