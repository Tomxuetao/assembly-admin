<template>
  <el-upload
    :headers="uploadHeader"
    :action="action"
    :accept="options.accept"
    :multiple="options.multiple"
    :limit="options.limit"
    :show-file-list="options.showFileList"
    :file-list="fileList"
    :on-error="onErrorHandle"
    :on-remove="onRemoveHandle"
    :on-exceed="onExceedHandle"
    :on-success="onSuccessHandle"
    :before-upload="beforeUploadHandle">
    <template #default>
      <slot></slot>
    </template>
    <template #tip>
      <slot name="tipText"></slot>
    </template>
  </el-upload>
</template>

<script>

import { ElMessage } from 'element-plus'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'base-upload',
  props: {
    action: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      required: true,
      default() {
        return {
          size: 10,
          limit: 1,
          accept: 'image/*',
          multiple: false,
          showFileList: true
        }
      }
    },
    fileList: {
      type: Array,
      required: false,
      default() {
        return []
      }
    }
  },
  setup(props) {
    const uploadHeader = {
      userId: sessionStorage.getItem('userId'),
      token: sessionStorage.getItem('token'),
      Authorization: sessionStorage.getItem('token'),
      roleId: sessionStorage.getItem('roleId') || '',
      accountNum: sessionStorage.getItem('accountNum') || undefined,
      accountName: encodeURIComponent(sessionStorage.getItem('accountName') || '')
    }
    const tempFileList = []
    if (props.fileList.length) {
      tempFileList.push(...props.fileList)
    }
    const onExceedHandle = () => {
      ElMessage.error(`只能上传${props.options.limit}个附件`)
    }

    const onSuccessHandle = (response) => {
      const { data } = response
      tempFileList.push(Object.assign(data, { name: data.fileName, url: data.filePath }))
    }

    const onRemoveHandle = ({id}) => {
      const tempIndex = tempFileList.findIndex((item) => item.id === id)
      if (tempIndex > -1) {
        tempFileList.splice(tempIndex, 1)
      }
    }

    const onErrorHandle = (err) => {
      const { message } = JSON.parse(err.message)
      ElMessage.error(message)
    }

    const beforeUploadHandle = (file) => {
      const { size } = file
      if (size > 1024 * 1024 * props.options.size) {
        ElMessage.error(`附件大小不能超过${props.options.size}M`)
        return false
      }
      return true
    }

    const getFileList = () => tempFileList

    return {
      uploadHeader,

      getFileList,
      onErrorHandle,
      onRemoveHandle,
      onExceedHandle,
      onSuccessHandle,
      beforeUploadHandle
    }
  }
})
</script>

<style scoped>

</style>
