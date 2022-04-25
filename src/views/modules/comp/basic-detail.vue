<template>
  <div class="basic-wrapper">
    <second-title title="基本信息" :show-block="true" :show-border="false"></second-title>
    <div class="form-wrapper">
      <el-form :inline="true" label-position="left" label-width="110px" class="custom-form">
        <el-row>
          <el-col :span="8">
            <el-form-item label="组件名称">{{ detailData.serviceName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="归属部门">{{ detailData.deptName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属应用">{{ detailData.systemName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属项目">{{ detailData.proName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="服务标签">{{ getLabelNameHandle(detailData.labelSelection, 0) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行业标签">{{ getLabelNameHandle(detailData.industryLabelSelection, 1) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="来源">{{ originMap.get(detailData.origin) }}</el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="技术联系人">{{ `${detailData.technicalContact}(电话：${detailData.telephone} 邮箱：${detailData.mail})` }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="每天推荐调用量">{{ detailData.transferDayRecommend }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="每天最大调用量">{{ detailData.transferDayMax }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="每月推荐调用量">{{ detailData.transferMonthRecommend }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="每月最大调用量">{{ detailData.transferMonthMax }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="上架时间">{{ detailData.releaseTime }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="更新时间">{{ detailData.modifyTime }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="服务图标">
              <template v-if="detailData.serviceFile">
                <img :src="detailData.serviceFile.filePath" style="width: 36px; height: 36px; border-radius: 8px;"  alt=""/>
                <el-button @click="downloadFileHandle(detailData.serviceFile.filePath)" type="text" style="margin-left: 16px;">下载</el-button>
              </template>
              <template v-else>暂无数据</template>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="API说明链接">
              {{ detailData.apiUrl ? detailData.apiUrl : '暂无数据' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="API文档">
              <template v-if="detailData.apiDoc">
                <span>{{ JSON.parse(detailData.apiDoc)[0].fileName }}</span>
                <el-button @click="downloadFileHandle(JSON.parse(detailData.apiDoc)[0].filePath)" type="text" style="margin-left: 16px;">下载</el-button>
              </template>
              <template v-else>暂无数据</template>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="申请模版">
              <template v-if="detailData.template">
                <span>{{ JSON.parse(detailData.template)[0].fileName }}</span>
                <el-button @click="downloadFileHandle(JSON.parse(detailData.template)[0].filePath)" type="text" style="margin-left: 16px;">下载</el-button>
              </template>
              <template v-else>组件被申请使用时，无需额外填写申请模版。</template>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="服务简介">{{ detailData.serviceIntro }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { downloadFileByUrl } from '@/utils'
import { getLabelListApi } from '@/api/comp-api'
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'basic-detail',
  props: {
    detailData: {
      required: true,
      type: Object
    }
  },
  setup() {
    const originMap = new Map([
      [0, '省'],
      [1, '市'],
      [2, '区']
    ])
    const store = useStore()
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

    const downloadFileHandle = (fileUrl) => {
      downloadFileByUrl(fileUrl)
    }

    const getLabelListHandle = () => {
      if (!industryLabelListComputed.value.length) {
        getLabelListApi({ labelType: 1 }).then(({ data }) => {
          const { industryLabel, resourceLabel } = data
          industryLabelListComputed.value = industryLabel.map((item) => {
            return { value: item.id, label: item.labelName, ...item }
          })
          serviceLabelListComputed.value = resourceLabel.map((item) => {
            return { value: item.id, label: item.labelName, ...item }
          })
        })
      }
    }
    getLabelListHandle()

    /**
     *
     * @param list
     * @param type: 0-服务标签、1-行业标签
     */
    const getLabelNameHandle = (list, type) => {
      if (Array.isArray(list)) {
        if (type === 0) {
          return serviceLabelListComputed.value.filter((item) => list.map((temp) => temp.serviceLabelId).includes(item.id)).map((res) => res.labelName).join(',')
        } else {
          return industryLabelListComputed.value.filter((item) => list.map((temp) => temp.serviceLabelId).includes(item.id)).map((res) => res.labelName).join(',')
        }
      } else {
        return '暂无数据'
      }
    }

    return {
      originMap,

      downloadFileHandle,
      getLabelNameHandle
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
