<template>
  <el-dialog v-model="visibleDialog" title="设置预警推送方式" :before-close="(done) => closeDialogHandle(done)" width="512px">
    <el-form :model="dataForm" :rules="dataRules" label-position="top" ref="dataFormRef">
      <el-form-item label="推送方式" prop="jobMode">
        <el-select v-model="dataForm.jobMode" placeholder="请选择推送方式" style="width: 100%;">
          <el-option v-for="item in cronMap.keys()" :key="item" :value="item" :label="cronMap.get(item)['text']"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeDialogHandle()" style="width: 116px">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="submitFormHandle()" style="width: 116px">提交</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { getAlertApi, setAlertApi } from '@/api/comp-api'

export default {
  name: 'alert-setting-dialog',
  setup() {
    const store = useStore()
    let dataForm = reactive({
      appId: undefined,
      cronExpression: undefined,
      jobMode: undefined,
      serviceId: undefined,
      updateUser: store.state.user.userName
    })

    const dataRules = {
      jobMode: [{ required: true, message: '不能为空', trigger: 'change' }]
    }

    const visibleDialog = ref(false)

    const cronMap = new Map([
      [5, {
        text: '不推送',
        value: ''
      }],
      [1, {
        text: '每小时推送一次',
        value: '0 0 0/1 * * ?'
      }],
      [2, {
        text: '间隔3小时推送一次',
        value: '0 0 0/3 * * ?'
      }],
      [3, {
        text: '每小时推送一次（晚上22：00-6：00 不推送）',
        value: '0 0 7,8,9,10,11,12,13,14,15,16,17,18,19,20,21 * * ?'
      }],
      [4, {
        text: '间隔3小时推送一次（晚上22：00-6：00 不推送）',
        value: '0 0 7,10,13,16,19 * * ?'
      }]
    ])

    const initDialogHandle = (dataOption) => {
      dataForm = Object.assign(dataForm, dataOption)
      getAlertApi({ serviceId: dataOption.serviceId }).then(({  data }) => {
        dataForm.jobMode = data ? Number(data) : undefined
        visibleDialog.value = true
      })
    }

    /**
     * 关闭弹窗
     * @param done
     */
    const closeDialogHandle = (done = null) => {
      dataFormRef.value.resetFields()
      if (done) {
        done()
      }
      visibleDialog.value = false
      submitLoading.value = false
    }

    const submitLoading = ref(false)

    const dataFormRef = ref()
    const submitFormHandle = () => {
      dataFormRef.value.validate((valid) => {
        if (valid) {
          const { value } = cronMap.get(dataForm.jobMode)
          dataForm.cronExpression = value
          submitLoading.value = true
          setAlertApi(dataForm).then(() => {
            submitLoading.value = false
            ElMessage.success('设置预警成功')
            closeDialogHandle()
          }).catch(() => {
            submitLoading.value = false
          })
        }
      })
    }
    return {
      cronMap,
      dataForm,
      dataRules,
      dataFormRef,
      submitLoading,
      visibleDialog,

      submitFormHandle,
      initDialogHandle,
      closeDialogHandle
    }
  }
}
</script>

<style scoped>

</style>
