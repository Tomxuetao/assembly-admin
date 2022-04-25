<template>
  <div class="release-wrapper">
    <div class="header-wrapper">
      <div v-for="(item, index) in stepArray" :key="index" class="header-item" :class="[index + 1 <= curActiveStep ? 'header-active' : '', index === stepArray.length - 1 ? 'header-special' : '']">
        <div class="step-num">
          <div class="num-inner">{{ item.num }}</div>
        </div>
        <div class="step-text">{{ item.text }}</div>
        <div class="step-line" v-if="index !== stepArray.length - 1" :class="[index + 1 < curActiveStep ? 'line-active' : '']"></div>
      </div>
    </div>
    <div class="content-wrapper" v-loading.body="contentLoading">
      <template v-if="curActiveStep === 1">
        <div class="content-step-one">
          <el-row :gutter="24">
            <el-col :span="4" @click="gotoNextHandle(0)" class="create-item">
              <div class="item-title">
                <icon-svg name="api" class="title-icon"></icon-svg>
                <span class="title-text">API方式组件注册</span>
              </div>
            </el-col>
            <el-col :span="4" @click="gotoNextHandle(1)" class="create-item">
              <div class="item-title">
                <icon-svg name="sdk" class="title-icon"></icon-svg>
                <span class="title-text">非API方式组件注册</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </template>
      <template v-if="[2, 3].includes(curActiveStep)">
        <template v-if="(id && Object.keys(detailData).length) || !id">
          <basic-form :comp-type="curCompType" :detail-data="shouldResetForm ? {} : detailData" :active-step="curActiveStep" @basicReady="basicReadyHandle" ref="basicFormRef"></basic-form>
          <auth-form :comp-id="compId" :auth-list="shouldResetForm ? [] : authList" @authReady="authReadyHandle" :active-step="curActiveStep" ref="authFormRef"></auth-form>
        </template>
        <template v-if="curCompType === 0">
          <interface-form :is-create="isCreate" :comp-id="compId" :active-step="curActiveStep"  ref="interfaceFormRef"></interface-form>
        </template>
      </template>
    </div>
    <div class="operate-wrapper">
      <template v-if="[2, 3].includes(curActiveStep)">
        <el-button @click="cancelHandle()" style="width: 116px; margin: 0 24px;" >取 消</el-button>
        <el-button v-if="curActiveStep !== 2" @click="gotoBackHandle()" style="width: 116px; margin: 0 24px;">上一步</el-button>
        <el-button v-if="curActiveStep !== 3" @click="gotoNextHandle()" type="primary" style="width: 116px; margin: 0 24px;">下一步</el-button>
        <el-button v-else @click="registerCompHandle()" type="primary" style="width: 116px; margin: 0 24px;" >提交</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { getSelectDetailApi, getServiceDetailApi, registryCompApi, updateCompApi } from '@/api/comp-api'
import { ElMessage, ElMessageBox } from 'element-plus'
import AuthForm from '@/views/modules/release/auth-form.vue'
import BasicForm from '@/views/modules/release/basic-form.vue'
import InterfaceForm from '@/views/modules/release/interface-form.vue'
import { useRouter } from 'vue-router'
import { isAuth } from '@/utils'

export default {
  name: 'index',
  props: {
    id: {
      type: String,
      required: false
    },
    type: {
      type: String,
      required: false
    },
    mode: {
      type: String,
      required: false
    }
  },
  components: { AuthForm, BasicForm, InterfaceForm },
  setup(props) {
    const contentLoading = ref(!!props.id)
    const stepArray = ref([
      { num: 1, text: '选择支持方式' },
      { num: 2, text: '组件信息配置' },
      { num: 3, text: '提交申请' }
    ])

    const isCreate = ref(!props.id)
    const curCompType = ref(props.mode === '0' ? 0 : 1)

    const curActiveStep = ref(props.id ? 2 : 1)

    const authFormRef = ref()
    const basicFormRef = ref()
    const interfaceFormRef = ref()

    /**
     * 下一步
     * @param compType 0-API方式组件注册、1-非API方式组件注册、undefined-需要校验表单填写，检验成功后到提交流程
     */
    const gotoNextHandle = (compType) => {
      if (compType === undefined) {
        validateFormHandle()
      } else {
        curActiveStep.value += 1
        curCompType.value = compType
      }
    }

    const cancelHandle = () => {
      ElMessageBox.confirm('退出页面后，编辑的数据将会丢失，您确认关闭吗？', '操作确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        curActiveStep.value = 1
        shouldResetForm.value = true
        router.push({ name: 'release-index' })
      })
    }

    const gotoBackHandle = () => {
      curActiveStep.value -= 1
    }

    const compId = ref(props.id || '')
    const basicReady = ref(false)
    const basicReadyHandle = (isReady, id) => {
      compId.value = id
      basicReady.value = isReady
    }

    const authReady = ref()
    const authReadyHandle = (ready) => {
      authReady.value = ready
    }

    let dataFrom = {}
    const validateFormHandle = () => {
      if (basicReady.value) {
        // 拿到基本信息
        dataFrom = basicFormRef.value.validateHandle()
        if (authReady.value) {
          if (curCompType.value === 0) {
            if (interfaceFormRef.value.validateHandle()) {
              curActiveStep.value = 3
            } else {
              ElMessage.warning('没有可用接口或接口没有通过测试')
            }
          } else {
            curActiveStep.value = 3
          }
        } else {
          ElMessage.warning('请保存授权信息')
        }
      } else {
        ElMessage.warning('请保存配置信息')
      }
    }

    const router = useRouter()
    const submitLoading = ref(false)
    const registerCompHandle = () => {
      submitLoading.value = true
      dataFrom.serviceAuthorizationInformation = authFormRef.value.validateHandle() || []
      const tempApi = isCreate.value ? registryCompApi : updateCompApi
      tempApi(dataFrom).then(() => {
        submitLoading.value = false
        ElMessage.success('发布成功，请耐心等待审批')
        if (isAuth('comp:comp:list')) {
          router.push({ name: 'comp-list' })
        } else {
          router.push({ name: 'overview-index' })
        }
      }).catch(() => {
        submitLoading.value = false
      })
    }

    /**
     * 获取详情信息
     */
    let detailData = reactive({})
    const authList = ref([])
    const shouldResetForm  = ref(false)
    const getDetailHandle = () => {
      if (props.id) {
        const tempApi = props.type === 'change' ? getSelectDetailApi : getServiceDetailApi
        tempApi({ id: props.id }).then(({ data }) => {
          contentLoading.value = false
          const { labelSelection, serviceAuthorizationInformation } = data
          authList.value = serviceAuthorizationInformation
          if (labelSelection && labelSelection.length) {
            data.labelSelection = labelSelection[0].serviceLabelId
          } else {
            data.labelSelection = undefined
          }
          detailData = Object.assign(detailData, data || {})
        }).catch(() => {
          contentLoading.value = false
        })
      }
    }
    getDetailHandle()

    return {
      compId,
      isCreate,
      authList,
      stepArray,
      detailData,
      authFormRef,
      curCompType,
      basicFormRef,
      curActiveStep,
      submitLoading,
      contentLoading,
      shouldResetForm,
      interfaceFormRef,

      cancelHandle,
      gotoBackHandle,
      gotoNextHandle,
      authReadyHandle,
      basicReadyHandle,
      registerCompHandle
    }
  }
}
</script>

<style scoped lang="scss">
.release-wrapper {
  height: calc(100vh - 108px);
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 1);

  .header-wrapper {
    display: flex;
    height: 63px;
    padding: 0 24px;
    cursor: pointer;
    border-bottom: 1px solid rgba(238, 238, 238, 1);
    font-family: PingFangSC-Medium;

    .header-item {
      display: flex;
      flex-basis: 50%;
      flex-wrap: nowrap;
      align-items: center;
      height: 63px;
      line-height: 63px;
      font-size: 14px;
      color: rgba(102, 102, 102, 1);
      font-weight: 500;

      .step-num {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        border-radius: 50%;
        border: 2px solid rgba(102, 102, 102, 1);

        .num-inner {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          height: 24px;
          width: 24px;
          font-size: 14px;
          text-align: center;
        }
      }

      .step-line {
        flex: 1;
        height: 2px;
        width: 100%;
        margin: 0 12px;
        background-color: rgba(102, 102, 102, 1);
      }

      .line-active {
        background-color: rgba(20, 146, 255, 1);
      }
    }

    .header-active {
      .step-num {
        color: rgba(255, 255, 255, 1);
        border-color: rgba(20, 146, 255, 1);
        background-color: rgba(20, 146, 255, 1);
      }

      .step-text {
        color: rgba(20, 146, 255, 1);
      }
    }

    .header-special {
      flex-basis: auto;

      .step-text {
        width: 64px;
      }
    }
  }

  .content-wrapper {
    height: calc(100vh - 232px);
    overflow-y: auto;
    .content-step-one {
      padding: 48px;

      .create-item {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 120px;
        cursor: pointer;
        margin-right: 36px;
        border-radius: 4px;
        border: 1px solid rgba(215, 215, 215, 1);

        .item-title {
          display: inline-flex;
          height: 24px;
          line-height: 24px;
          font-size: 18px;
          color: #333333;
          font-weight: 500;
          font-family: PingFangSC-Medium;

          .title-icon {
            font-size: 24px;
            margin-right: 12px;
          }
        }
      }
    }
  }

  .operate-wrapper {
    height: 64px;
  }
}
</style>
