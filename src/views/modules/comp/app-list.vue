<template>
  <div class="app-wrapper">
    <second-title title="应用列表"></second-title>
    <div class="table-operate">
      <el-form :model="searchForm" :inline="true" ref="searchFormRef" class="search-form">
        <el-form-item label="应用名称" prop="appName">
          <el-input v-model="searchForm.appName" placeholder="请输入应用名称" style="width: 280px;"></el-input>
        </el-form-item>
        <el-form-item label="建设单位" prop="constructUnit">
          <el-input v-model="searchForm.constructUnit" placeholder="请输入建设单位" style="width: 280px;"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="resetSearchFormHandle()" style="width: 116px;">重置</el-button>
        <el-button type="primary" @click="getDataListHandle()" style="width: 116px;">查询</el-button>
      </div>
    </div>
    <div class="table-content">
      <el-table :data="dataList" row-key="id" v-loading="dataListLoading" height="740">
        <el-table-column label="应用名称" prop="appName" show-overflow-tooltip></el-table-column>
        <el-table-column label="建设单位" prop="constructUnit" show-overflow-tooltip></el-table-column>
        <el-table-column label="所属部门" prop="deptName" show-overflow-tooltip></el-table-column>
        <el-table-column label="业务负责人" prop="businessOwner" width="200">
          <template #default="scope">
            {{ `${scope.row.businessOwner} ${scope.row.businessOwnerContact}` }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="170">
          <template #default="scope">
            {{ dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-wrapper">
      <base-pagination :page="searchForm" :total="total" :getDataList="getDataListHandle"></base-pagination>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { reactive, ref } from 'vue'
import { getAppListApi } from '@/api/comp-api'

export default {
  name: 'app-list',
  setup() {
    const total = ref(0)
    const searchForm = reactive({
      pageNum: 1,
      pageSize: 10,
      appName: undefined,
      constructUnit: undefined
    })
    const statusMap = new Map([
      [0, '待发布'],
      [1, '发布中'],
      [2, '已过期']
    ])
    const dataList = ref([])

    const dataListLoading = ref(false)
    const getDataListHandle = (page = { pageNum: 1, pageSize: 10 }) => {
      dataListLoading.value = true
      getAppListApi(Object.assign(searchForm, page)).then(({ data }) => {
        const { records: list, total: count } = data
        total.value = count
        dataList.value = list
      }).finally(() => {
        dataListLoading.value = false
      })
    }
    getDataListHandle()

    const searchFormRef = ref()
    const resetSearchFormHandle = () => {
      searchFormRef.value.resetFields()
      getDataListHandle()
    }

    return {
      total,
      dayjs,
      dataList,
      statusMap,
      searchForm,
      searchFormRef,
      dataListLoading,

      getDataListHandle,
      resetSearchFormHandle
    }
  }
}
</script>

<style scoped lang="scss">
.app-wrapper {
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
