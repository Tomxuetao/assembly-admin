<template>
  <el-dialog v-model="dialogFormVisible" :before-close="(done) => showOrCloseDialogHandle(done)" :title="isUpdate ? '修改' : '新增'" width="60%" custom-class="custom-dialog" top="10vh">
    <second-title title="基础信息" :show-block="true" :show-border="false" style="margin: -24px 0 0 -24px"></second-title>
    <el-form :model="dataForm" :rules="dataRules" ref="dataFormRef" label-position="top" label-width="80px">
      <el-row :gutter="48">
        <el-col :span="8">
          <el-form-item label="接口名称" prop="interfaceName">
            <el-input v-model="dataForm.interfaceName" placeholder="请输入接口名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="接口类型" prop="interfaceType">
            <el-select v-model="dataForm.interfaceType" placeholder="请选择接口类型" style="width: 100%">
              <el-option label="API" :value="0"></el-option>
              <el-option label="SPI" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="接口描述" prop="remark">
            <el-input v-model="dataForm.remark" placeholder="请输入接口描述"></el-input>
          </el-form-item>
        </el-col>
        <template v-if="dataForm.interfaceType === 0">
          <el-col :span="8">
            <el-form-item label="测试地址" prop="testTargetAddress">
              <el-input v-model="dataForm.testTargetAddress" placeholder="请输入测试地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产地址" prop="productionTargetAddress">
              <el-input v-model="dataForm.productionTargetAddress" placeholder="请输入生产地址"></el-input>
            </el-form-item>
          </el-col>
        </template>
        <el-col :span="8">
          <el-form-item label="接入协议" prop="agreementRequestMethod">
            <el-select v-model="dataForm.agreementRequestMethod" placeholder="请选择接入协议" style="width: 100%">
              <el-option label="HTTP" :value="0"></el-option>
              <el-option label="HTTPS" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="请求方式" prop="requestMethod">
            <el-select v-model="dataForm.requestMethod" placeholder="请选择请求方式" style="width: 100%">
              <el-option v-for="item in requestMethodMap.keys()" :value="item" :label="requestMethodMap.get(item)" :key="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="请求征文格式" prop="requestContentType">
            <el-select v-model="dataForm.requestContentType" @change="contentTypeChangeHandle" placeholder="请选择请求征文格式" style="width: 100%">
              <el-option v-for="item in requestContentTypeMap.keys()" :value="item" :label="requestContentTypeMap.get(item)" :key="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="请求编码" prop="requestCode">
            <el-select v-model="dataForm.requestCode" placeholder="请选择请求编码" style="width: 100%">
              <el-option v-for="item in requestCodeMap.keys()" :value="item" :label="requestCodeMap.get(item)" :key="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <second-title title="参数配置" :show-block="true" :show-border="false" style="margin: -24px 0 0 -24px"></second-title>
      <el-table :data="dataList">
        <el-table-column label="配置类型" prop="type">
          <template #default="scope">
            <el-select v-model="scope.row.type" @change="(value) => configTypeChangeHandle(value, scope)" placeholder="请选择配置类型">
              <el-option v-for="item in configTypeMap.keys()" :value="item" :label="configTypeMap.get(item)" :disabled="item === 0 && dataForm.requestContentType === 'application/json' && dataList.find((item) => item.type === 0)" :key="item"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="参数名称" prop="paramName">
          <template #default="scope">
            <el-input v-model="scope.row.paramName" :disabled="![0, 1, 2, 3].includes(scope.row.type) || (scope.row.type === 0 && dataForm.requestContentType === 'application/json')" placeholder="请输入参数名称"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="参数类型" prop="paramType">
          <template #default="scope">
            <el-select v-model="scope.row.paramType" :disabled="![0, 1, 3].includes(scope.row.type) || (scope.row.type === 0 && dataForm.requestContentType === 'application/json')" placeholder="请选择参数类型">
              <template v-if="scope.row.paramsTypeMap">
                <el-option v-for="item in scope.row.paramsTypeMap.keys()" :value="item" :label="scope.row.paramsTypeMap.get(item)" :key="item"></el-option>
              </template>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="参数描述" prop="paramDesc">
          <template #default="scope">
            <el-input v-model="scope.row.paramDesc" :disabled="![0, 1, 2, 3].includes(scope.row.type)" placeholder="请输入描述信息"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="是否必填" prop="isRequired" align="center" width="120">
          <template #default="scope">
            <el-checkbox v-model="scope.row.isRequired" :disabled="![0, 1, 2, 3].includes(scope.row.type)" :true-label="1" :false-label="0"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template #default="scope">
            <el-button @click="deleteOrAddOneHandle(0, scope.$index)" size="small" type="text" style="color: rgb(251, 91, 91);">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex; justify-content: center; padding: 24px 0 0 0;">
        <el-button @click="deleteOrAddOneHandle(1)" :disabled="!dataForm.requestContentType" type="text">
          <el-icon class="el-input__icon"><plus></plus></el-icon>
          新增
        </el-button>
      </div>
      <el-form-item label="返回示例">
        <el-input type="textarea" :autosize=" { minRows: 3, maxRows: 6 }" placeholder="请输入返回示例"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showOrCloseDialogHandle()" style="width: 116px">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="submitFormHandle" style="width: 116px">提交
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { nextTick, reactive, ref } from 'vue'
import { saveInterfaceApi, updateInterfaceApi } from '@/api/comp-api'

export default {
  name: 'interface-add-or-update',
  emits: ['update-list'],
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

    const requestCodeMap = new Map([
      ['GBK', 'GBK'],
      ['UTF-8', 'UTF-8'],
      ['UTF-16', 'UTF-16'],
      ['ASCII 码', 'ASCII 码'],
      ['ISO-8859-1', 'ISO-8859-1']
    ])

    const requestContentTypeMap = new Map([
      ['application/json', 'application/json'],
      ['application/x-www-form-urlencoded', 'application/x-www-form-urlencoded']
    ])

    const isUpdate = ref(false)

    const initDialogHandle = (data, updateOrAdd) => {
      dialogFormVisible.value = true
      isUpdate.value = updateOrAdd
      dataForm = Object.assign(dataForm, data)
    }

    const dataRules = {
      interfaceName: [{ required: true, message: '不能为空', trigger: 'change' }],
      interfaceType: [{ required: true, message: '不能为空', trigger: 'change' }],
      testTargetAddress: [{ required: true, message: '不能为空', trigger: 'blur' }],
      productionTargetAddress: [{ required: true, message: '不能为空', trigger: 'blur' }],
      agreementRequestMethod: [{ required: true, message: '不能为空', trigger: 'blur' }],
      requestMethod: [{ required: true, message: '不能为空', trigger: 'blur' }],
      requestContentType: [{ required: true, message: '不能为空', trigger: 'blur' }]
    }

    const dialogFormVisible = ref(false)
    const showOrCloseDialogHandle = (done = null) => {
      dialogFormVisible.value = !dialogFormVisible.value
      if (done) {
        done()
      }
      submitLoading.value = false
      nextTick(() => {
        dataFormRef.value.resetFields()
      })
    }

    const submitLoading = ref(false)
    const dataFormRef = ref()
    const submitFormHandle = () => {
      dataFormRef.value.validate((valid) => {
        if (valid) {
          submitLoading.value = true
          const tempApi = isUpdate.value ? updateInterfaceApi : saveInterfaceApi
          dataForm.interfaceParameter = dataList.value
          tempApi(dataForm).then(() => {
            emit('update-list')
            showOrCloseDialogHandle()
          }).catch(() => {
            submitLoading.value = false
          })
        }
      })
    }

    const deleteOrAddOneHandle = (type, index = 0) => {
      if (type === 0) {
        dataList.value.splice(index, 1)
      } else {
        dataList.value.push({
          type: undefined,
          paramName: undefined,
          paramType: undefined,
          paramDesc: undefined,
          isRequired: undefined
        })
      }
    }

    const contentTypeChangeHandle = (value) => {
      console.log(value)
    }

    const tempParamsTypeMap = new Map([
      [3, new Map([[0, '字符串']])],
      [0, new Map([[0, '字符串'], [1, '数字'], [2, '日期']])],
      [1, new Map([[0, '字符串'], [1, '数字'], [2, '日期'], [3, '文件']])],
      [2, new Map([[0, '字符串']])]
    ])

    const configTypeChangeHandle = (value, scope) => {
      scope.row.paramsTypeMap = tempParamsTypeMap.get(value)
      dataList.value[scope.$index].paramType = undefined
      dataList.value[scope.$index].paramName = undefined
      if (value === 0 && dataForm.requestContentType === 'application/json') {
        dataList.value[scope.$index].paramType = 0
        dataList.value[scope.$index].paramName = 'jsonParam'
      }
    }

    return {
      isUpdate,
      dataForm,
      dataList,
      dataRules,
      dataFormRef,
      configTypeMap,
      submitLoading,
      requestCodeMap,
      requestMethodMap,
      dialogFormVisible,
      requestContentTypeMap,

      submitFormHandle,
      initDialogHandle,
      deleteOrAddOneHandle,
      configTypeChangeHandle,
      showOrCloseDialogHandle,
      contentTypeChangeHandle
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
