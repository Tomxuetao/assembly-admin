<template>
  <div class="basic-wrapper">
    <second-title title="基本信息" :show-block="true" :show-border="false"></second-title>
    <div class="form-wrapper">
      <el-form :model="dataForm" :rules="dataRules" :disabled="disabledForm" ref="dataFormRef" label-position="top" label-width="110px">
        <el-row :gutter="48">
          <el-col :span="6">
            <el-form-item label="组件名称" prop="serviceName">
              <el-input v-model="dataForm.serviceName" placeholder="请输入组件名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="归属部门" prop="deptName">
              <el-input v-model="dataForm.deptName" disabled placeholder="请输入归属部门"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属应用" prop="systemCode">
              <el-select v-model="dataForm.systemCode" @change="selectChangeHandle" filterable placeholder="请选择所属应用" style="width: 100%">
                <el-option v-for="item in allAllAppListComputed" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属项目" prop="proName">
              <el-input v-model="dataForm.proName" disabled placeholder="所属项目会根据所属所属应用获取"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="服务标签" prop="labelSelection">
              <el-select v-model="dataForm.labelSelection" filterable placeholder="请选择服务标签" style="width: 100%">
                <el-option v-for="item in serviceLabelListComputed" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="行业标签" prop="industryLabelSelection">
              <el-select v-model="dataForm.industryLabelSelection" multiple collapse-tags filterable placeholder="请选择行业标签" style="width: 100%">
                <el-option v-for="item in industryLabelListComputed" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="组件来源" prop="origin">
              <el-select v-model="dataForm.origin" placeholder="请选择组件来源" style="width: 100%">
                <el-option v-for="item in originMap.keys()" :key="item" :label="originMap.get(item)" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="技术联系人" prop="technicalContact">
              <el-input v-model="dataForm.technicalContact" placeholder="请输入技术联系人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系电话" prop="telephone">
              <el-input v-model="dataForm.telephone" placeholder="请输入联系电话"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系邮箱" prop="mail">
              <el-input v-model="dataForm.mail" placeholder="请输入联系邮箱"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="每天推荐调用量" prop="transferDayRecommend">
              <el-input v-model.number="dataForm.transferDayRecommend" placeholder="请输入每天推荐调用量"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="每天最大调用量" prop="transferDayMax">
              <el-input v-model.number="dataForm.transferDayMax" placeholder="请输入每天最大调用量"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="每月推荐调用量" prop="transferMonthRecommend">
              <el-input v-model.number="dataForm.transferMonthRecommend" placeholder="请输入每月推荐调用量"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="每月最大调用量" prop="transferMonthMax">
              <el-input v-model.number="dataForm.transferMonthMax" placeholder="请输入每月最大调用量"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="API说明链接" prop="apiUrl">
              <el-input v-model="dataForm.apiUrl" placeholder="请输入API说明链接"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="API文档" prop="apiDoc">
              <base-upload
                ref="baseUploadApiRef"
                action="/proxyMainApi/AboutFile/uploadFile"
                :options="{ size: 10, limit: 1, multiple: false }">
                <el-button size="small" type="primary">
                  <el-icon><upload-filled></upload-filled></el-icon>
                  选择文件
                </el-button>
                <template #tipText>
                  <div class="el-upload__tip">附件大小不超过10M</div>
                </template>
              </base-upload>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请模版" prop="template">
              <base-upload
                ref="baseUploadTempRef"
                action="/proxyMainApi/AboutFile/uploadFile"
                :options="{ size: 10, limit: 1, multiple: false }">
                <el-button size="small" type="primary">
                  <el-icon><upload-filled></upload-filled></el-icon>
                  选择文件
                </el-button>
                <template #tipText>
                  <div class="el-upload__tip">附件大小不超过10M</div>
                </template>
              </base-upload>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="服务图标">
              <base-upload
                ref="baseUploadIconRef"
                action="/proxyMainApi/AboutFile/upload"
                :options="{ size: 1, limit: 1, accept: 'image/*', multiple: false }">
                <el-button size="small" type="primary">
                  <el-icon><upload-filled></upload-filled></el-icon>
                  选择文件
                </el-button>
                <template #tipText>
                  <div class="el-upload__tip">服务图标大小不超过1M支持图片格式文件上传</div>
                </template>
              </base-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="服务简介" prop="serviceIntro">
              <el-input v-model="dataForm.serviceIntro" type="textarea" placeholder="请输入服务简介"></el-input>
            </el-form-item>
          </el-col>
          <template v-if="compType === 1">
            <el-divider>SDK包上传（仅支持JAVA格式上传）</el-divider>
            <el-col :span="24">
              <el-form-item label="SDK包上传" prop="apiJar">
                <base-upload
                  ref="baseUploadJarRef"
                  action="/proxyMainApi/AboutFile/uploadJar"
                  :options="{ size: 10, limit: 1, accept: '.jar', multiple: false }">
                  <el-button size="small" type="primary">
                    <el-icon><upload-filled></upload-filled></el-icon>
                    选择文件
                  </el-button>
                </base-upload>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="SDK说明" prop="jarRemark">
                <el-input v-model="dataForm.jarRemark" type="textarea" placeholder="请输入SDK说明"></el-input>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>
    </div>
    <template v-if="activeStep !==3">
      <div style="display: flex; justify-content: center;">
        <el-button v-if="!disabledForm" @click="saveToDraftsHandle()" :loading="submitLoading" type="success">保存基本信息</el-button>
        <el-button v-else @click="editBasicHandle()" type="success">编辑基本信息</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, reactive, ref } from 'vue'
import { getAllAppListApi, getLabelListApi, getProByAppIdApi, validateCompNameApi, saveToDraftsApi } from '@/api/comp-api'
import { isEmail, isMobile, isURL } from '@/utils/validate'
import cloneDeep from 'lodash/cloneDeep'
import { ElMessage } from 'element-plus'

export default {
  name: 'basic-form',
  props: {
    compType: {
      required: true,
      type: Number
    },
    activeStep: {
      required: true,
      type: Number
    },
    detailData: {
      required: false,
      type: Object,
      default: () => {}
    }
  },
  emits: ['basic-ready'],
  setup(props, { emit }) {
    let dataForm = reactive({
      id: undefined,
      apiDoc: undefined,
      apiUrl: undefined,
      deptCode: sessionStorage.getItem('accountNum'),
      deptName: sessionStorage.getItem('accountName'),
      mail: undefined,
      origin: undefined,
      proCode: undefined,
      proName: undefined,
      serviceMode: props.compType,
      serviceFile: undefined,
      serviceIntro: undefined,
      serviceName: undefined,
      systemCode: undefined,
      systemName: undefined,
      telephone: undefined,
      template: undefined,
      labelSelection: undefined,
      technicalContact: undefined,
      transferDayMax: undefined,
      industryLabelSelection: [],
      transferDayRecommend: undefined,
      transferMonthMax: undefined,
      transferMonthRecommend: undefined,
      apiJar: undefined,
      jarRemark: undefined
    })

    const apiJarList = ref([])
    const serviceFileList = ref([])
    const templateList = ref([])
    const apiDocList = ref([])
    if (Object.keys(props.detailData || {}).length) {
      dataForm = Object.assign(dataForm, props.detailData)
      const { apiJar, serviceFile, template, apiDoc } = dataForm
      apiJarList.value = apiJar ? [JSON.parse(apiJar)] : []
      serviceFileList.value = serviceFile ? [serviceFile] : []
      templateList.value = template ? JSON.parse(template) : []
      apiDocList.value = apiDoc ? JSON.parse(apiDoc) : []
    }

    const originMap = new Map([
      [0, '省'],
      [1, '市'],
      [2, '区']
    ])

    const disabledForm = ref(false)

    const validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }

    const validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }

    const validateUrl = (rule, value, callback) => {
      if (value) {
        if (!isURL(value)) {
          callback(new Error('链接格式错误'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    const validateMax = (rule, value, callback) => {
      if (value) {
        const { field } = rule
        if (field === 'transferMonthMax') {
          if (value > dataForm.transferMonthRecommend) {
            callback()
          } else {
            callback(new Error('每月最大调用量必须大于每月推荐调用量'))
          }
        } else {
          if (value > dataForm.transferDayRecommend) {
            callback()
          } else {
            callback(new Error('每天最大调用量必须大于每天推荐调用量'))
          }
        }
      } else {
        callback()
      }
    }

    const dataRules = {
      serviceName: [{ required: true, message: '不能为空', trigger: 'blur' }],
      systemCode: [{ required: true, message: '不能为空', trigger: 'change' }],
      labelSelection: [{ required: true, message: '不能为空', trigger: 'change' }],
      industryLabelSelection: [{ required: true, message: '不能为空', trigger: 'change' }],
      origin: [{ required: true, message: '不能为空', trigger: 'change' }],
      mail: [{ required: true, message: '不能为空', trigger: 'blur' }, { validator: validateEmail, trigger: 'blur' }],
      telephone: [{ required: true, message: '不能为空', trigger: 'blur' }, { validator: validateMobile, trigger: 'blur' }],
      technicalContact: [{ required: true, message: '不能为空', trigger: 'blur' }],
      transferDayMax: [{ required: true, message: '不能为空', trigger: 'blur' }, { validator: validateMax, trigger: 'blur' }],
      transferDayRecommend: [{ required: true, message: '不能为空', trigger: 'blur' }],
      transferMonthRecommend: [{ required: true, message: '不能为空', trigger: 'blur' }],
      transferMonthMax: [{ required: true, message: '不能为空', trigger: 'blur' }, { validator: validateMax, trigger: 'blur' }],
      serviceIntro: [{ required: true, message: '不能为空', trigger: 'blur' }],
      apiUrl: [{ required: false, validator: validateUrl, trigger: 'blur' }],
      apiJar: [{ required: true, message: '不能为空', trigger: 'blur' }]
    }

    const dataFormRef = ref()

    const store = useStore()
    const allAllAppListComputed = computed({
      get: () => {
        return store.state.comp.allAppList
      },
      set: (value) => {
        store.commit('comp/updateAllAppList', value)
      }
    })

    const getAllAppListHandle = () => {
      if (!allAllAppListComputed.value.length) {
        getAllAppListApi().then(({ data }) => {
          if (Array.isArray(data)) {
            allAllAppListComputed.value = data.map((item) => {
              return { value: item.id + '', label: item.appName, proCode: null, proName: null }
            })
          } else {
            allAllAppListComputed.value = []
          }
        })
      }
    }
    getAllAppListHandle()

    const selectChangeHandle = (value) => {
      const temp = allAllAppListComputed.value.find((item) => item.value === value)
      if (!temp.proCode && !temp.proName) {
        getProByAppIdApi({ systemCode: value }).then(({ data }) => {
          const { projectNo: proCode, projectName: proName } = data
          temp.proCode = proCode
          temp.proName = proName
          dataForm.proCode = temp.proCode
          dataForm.proName = temp.proName
          dataForm.systemName = temp.label
        })
      } else {
        dataForm.proCode = temp.proCode
        dataForm.proName = temp.proName
        dataForm.systemName = temp.label
      }
    }

    const industryLabelListComputed = computed({
      get: () => {
        return store.state.comp.industryLabelList
      },
      set: (list) => {
        store.commit('comp/updateIndustryLabelList', list)
      }
    })

    const serviceLabelListComputed = computed({
      get: () => {
        return store.state.comp.serviceLabelList
      },
      set: (list) => {
        store.commit('comp/updateServiceLabelList', list)
      }
    })

    const getLabelListHandle = () => {
      if (!industryLabelListComputed.value.length) {
        getLabelListApi({ labelType: 1 }).then(({ data }) => {
          const { industryLabel, resourceLabel } = data
          industryLabelListComputed.value = industryLabel.map((item) => {
            return { value: item.id, serviceLabelId: item.id, label: item.labelName, ...item }
          })
          serviceLabelListComputed.value = resourceLabel.map((item) => {
            return { value: item.id, serviceLabelId: item.id, label: item.labelName, ...item }
          })
        })
      }
    }
    getLabelListHandle()

    // 外部调用获取参数
    let resultDataForm = {}
    const validateHandle = () => {
      return resultDataForm
    }

    const editBasicHandle = () => {
      disabledForm.value = false
      emit('basic-ready', false, dataForm.id)
    }

    const baseUploadApiRef = ref()
    const baseUploadJarRef = ref()
    const baseUploadTempRef = ref()
    const baseUploadIconRef = ref()
    const submitLoading = ref(false)
    const saveToDraftsHandle = () => {
      dataFormRef.value.validate((valid) => {
        if (valid) {
          submitLoading.value = true
          const serviceFileTemp = baseUploadIconRef.value.getFileList()
          const templateFileTemp = baseUploadTempRef.value.getFileList()
          const apiFileTemp = baseUploadApiRef.value.getFileList()
          const tempForm = {
            apiJar: undefined,
            serviceFile: serviceFileTemp.length ?  serviceFileTemp[0] : undefined,
            template: templateFileTemp.length ? JSON.stringify(templateFileTemp.map((item) => {return {id: item.id, fileName: item.fileName, filePath: item.filePath}})) : undefined,
            apiDoc: apiFileTemp.length ? JSON.stringify(apiFileTemp.map((item) => {return {id: item.id, fileName: item.fileName, filePath: item.filePath}})) : undefined,
            labelSelection: [serviceLabelListComputed.value.find((item) => item.value === dataForm.labelSelection)],
            industryLabelSelection: industryLabelListComputed.value.filter((item) => dataForm.industryLabelSelection.includes(item.value))
          }
          if (dataForm.serviceMode === 1) {
            const jarFileTemp = baseUploadJarRef.value.getFileList()
            tempForm.apiJar = jarFileTemp.length ? JSON.stringify(jarFileTemp.map((item) => {return {id: item.id, fileName: item.fileName, filePath: item.filePath}})) : undefined
          }
          saveToDraftsApi(Object.assign(cloneDeep(dataForm), tempForm)).then(({ data }) => {
            resultDataForm = cloneDeep(data)
            const { id } = data
            dataForm.id = id
            disabledForm.value = true
            submitLoading.value = false
            emit('basic-ready', true, id)
            ElMessage.success('基本信息保存成功')
          }).catch(() => {
            submitLoading.value = false
          })
        }
      })
    }
    return {
      dataForm,
      dataRules,
      originMap,
      dataFormRef,
      disabledForm,
      submitLoading,
      baseUploadApiRef,
      baseUploadJarRef,
      baseUploadTempRef,
      baseUploadIconRef,
      allAllAppListComputed,
      serviceLabelListComputed,
      industryLabelListComputed,

      validateHandle,
      editBasicHandle,
      selectChangeHandle,
      saveToDraftsHandle
    }
  }
}
</script>

<style scoped lang="scss">
.basic-wrapper {
  .form-wrapper {
    padding: 0 24px;
  }
}
</style>
