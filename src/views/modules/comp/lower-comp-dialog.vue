<template>
  <el-dialog v-model="visibleDialog" title="应用组件下架" :before-close="(done) => closeDialogHandle(done)" width="512px">
    <el-form :model="dataForm" :rules="dataRules" label-position="top" ref="dataFormRef">
      <div class="warn-wrapper">
        <icon-svg name="warn" style="color: #ff584c;" class="icon-svg"></icon-svg>
        <span class="warn-text">{{ `当前共有${total}个应用系统在使用该组件` }}</span>
      </div>
      <div style="padding: 16px 0;">下架应用组件会给使用者带来很大的影响，请谨慎操作。如果您确定要下架该组件，请设置一定缓冲期（不得少于10个自然日）。以便使用方有足够的时间应对。</div>
      <el-form-item label="选择下架内容" prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio :label="0">下架组件</el-radio>
          <el-radio :label="1">下架接口</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="dataForm.type === 1">
        <el-form-item label="请选择接口" prop="interfaceIds">
          <el-checkbox-group v-model="dataForm.interfaceIds">
            <el-checkbox v-for="item in interfaceArray" :key="item.id" :label="item.id" :disabled="item.interfaceStatus !==0">{{ item.interfaceName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </template>
      <el-form-item label="下架时间" prop="removeDate">
        <el-date-picker v-model="dataForm.removeDate" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择下架时间" style="width: 100%"></el-date-picker>
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
import { getCompUseApi, lowerCompApi } from '@/api/comp-api'

export default {
  name: 'lower-comp-dialog',
  setup() {
    let dataForm = reactive({
      type: 0,
      removeDate: undefined,
      serviceId: undefined,
      interfaceIds: []
    })

    const dataRules = {
      type: [{ required: true, message: '不能为空', trigger: 'change' }],
      removeDate: [{ required: true, message: '不能为空', trigger: 'change' }],
      interfaceIds: [{ required: true, message: '不能为空', trigger: 'change' }]
    }

    const total = ref(0)
    const visibleDialog = ref(false)
    const interfaceArray = ref([])
    const initDialogHandle = (id) => {
      dataForm.serviceId = id
      getCompUseApi({ serviceId: id }).then(({ data }) => {
        const { count, interfaceInfoList } = data
        total.value = count
        interfaceArray.value = interfaceInfoList
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
          submitLoading.value = true
          lowerCompApi(dataForm).then(() => {
            submitLoading.value = false
            closeDialogHandle()
          }).catch(() => {
            submitLoading.value = false
          })
        }
      })
    }
    return {
      total,
      dataForm,
      dataRules,
      dataFormRef,
      submitLoading,
      visibleDialog,
      interfaceArray,

      submitFormHandle,
      initDialogHandle,
      closeDialogHandle
    }
  }
}
</script>

<style scoped lang="scss">
.warn-wrapper {
  display: flex;
  height: 18px;
  line-height: 18px;
  color: #ff584c;
  font-size: 14px;

  .icon-svg {
    display: inline-block;
    color: #ff584c;
    font-size: 18px;
  }

  .warn-text {
    display: inline-block;
    margin-left: 12px;
  }
}

</style>
