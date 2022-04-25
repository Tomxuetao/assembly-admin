<template>
  <div class="alarm-wrapper">
    <second-title title="告警列表"></second-title>
    <div class="table-operate">
      <el-form :model="searchForm" :inline="true" ref="searchFormRef" class="search-form">
        <el-form-item label="告警类型" prop="warningType">
          <el-select v-model="searchForm.warningType" placeholder="请选择告警类型" style="width: 280px;">
            <el-option v-for="item in warningTypeMap.keys()" :label="warningTypeMap.get(item)" :value="item" :key="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="告警时间" prop="dateRange" style="margin-right: 32px;">
          <el-date-picker v-model="searchForm.dateRange" type="daterange" value-format="YYYY-MM-DD" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="resetSearchFormHandle()" style="width: 116px;">重置</el-button>
        <el-button type="primary" @click="getDataListHandle()" style="width: 116px;">查询</el-button>
      </div>
    </div>
    <div class="table-content">
      <el-table :data="dataList" row-key="id" v-loading="dataListLoading" height="740">
        <el-table-column label="告警类型" prop="warningType" show-overflow-tooltip>
          <template #default="scope">
            {{ warningTypeMap.get(Number(scope.row.warningType)) }}
          </template>
        </el-table-column>
        <el-table-column label="告警说明" prop="warningExplains" show-overflow-tooltip></el-table-column>
        <el-table-column label="所属部门" show-overflow-tooltip>
          {{ appInfo.constructUnit }}
        </el-table-column>
        <el-table-column label="业务负责人" prop="businessOwner" width="200">
          {{ `${appInfo.businessOwner} ${appInfo.businessOwnerContact}` }}
        </el-table-column>
        <el-table-column label="开发公司" show-overflow-tooltip>
          {{ appInfo.developUnitName }}
        </el-table-column>
        <el-table-column label="开发负责人" prop="businessOwner" width="200">
          {{ `${appInfo.developName} ${appInfo.developConcat}` }}
        </el-table-column>
        <el-table-column label="告警时间" prop="warningTime" width="160"></el-table-column>
      </el-table>
    </div>
    <div class="page-wrapper">
      <base-pagination :page="searchForm" :total="total" :getDataList="getDataListHandle"></base-pagination>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { getCompAlarmApi } from '@/api/comp-api'

const props = defineProps({
  serviceId: {
    type: String,
    required: true
  }
})

const searchForm = reactive({
  pageNum: 1,
  pageSize: 10,
  startTime: undefined,
  endTime: undefined,
  warningType: undefined,
  serviceId: props.serviceId,
  sortName: 'warningTime',
  sortType: 'DESC',
  dateRange: []
})

const warningTypeMap = new Map([
  ['0', '调用失败'],
  ['1', '服务异常']
])
let appInfo = reactive({})
const total = ref(0)
const dataList = ref([])
const dataListLoading = ref(false)
const getDataListHandle = () => {
  const tempDateRange = searchForm.dateRange
  getCompAlarmApi(Object.assign({ ...searchForm }, { dateRange: [] },tempDateRange.length ? {startTime: tempDateRange[0], endTime: tempDateRange[1] } : {})).then(({ data }) => {
    const { total: count, list, applicationInfo } = data
    appInfo = Object.assign(appInfo, applicationInfo)
    dataList.value = list
    total.value = count
  })
}
getDataListHandle()

const searchFormRef = ref()
const resetSearchFormHandle = () => {
  searchFormRef.value.resetFields()
  getDataListHandle()
}
</script>

<style scoped lang="scss">
.alarm-wrapper {
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 1);

  .table-operate {
    display: flex;
    justify-content: space-between;
    padding: 12px 24px 0 24px;
  }

  .table-content {
    padding: 0 24px;
  }

  .page-wrapper {
    display: flex;
    justify-content: flex-end;
    padding: 24px;
  }
}
</style>
