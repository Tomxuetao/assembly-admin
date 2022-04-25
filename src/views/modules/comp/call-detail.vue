<template>
  <div class="detail-wrapper">
    <second-title title="调用详情"></second-title>
    <div class="table-search">
      <el-form :model="searchForm" :inline="true" ref="searchFormRef" class="search-form">
        <el-form-item label="调用部门" prop="deptName">
          <el-input v-model="searchForm.deptName" placeholder="请输入调用部门" style="width: 280px;"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="resetSearchFormHandle()" style="width: 116px;">重 置</el-button>
        <el-button type="primary" @click="getDataListHandle()" style="width: 116px;">查 询</el-button>
      </div>
    </div>
    <div class="table-operate">
      <div>
        <el-button size="small" @click="exportDataListHandle()" style="width: 88px; margin: 0;">导 出</el-button>
      </div>
    </div>
    <div class="table-content">
      <el-table :data="dataList" ref="tableRef" row-key="applicationId" @selection-change="selectionChangeHandle" v-loading="dataListLoading" height="650">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="调用部门" prop="deptName" show-overflow-tooltip></el-table-column>
        <el-table-column label="调用系统" prop="appName" show-overflow-tooltip></el-table-column>
        <el-table-column label="调用总数" prop="invocationNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="成功次数" prop="successNum" width="160"></el-table-column>
        <el-table-column label="失败次数" prop="failNum" width="140"></el-table-column>
      </el-table>
    </div>
    <div class="page-wrapper">
      <base-pagination :page="searchForm" :total="total" :getDataList="getDataListHandle"></base-pagination>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { downloadExport } from '@/utils'
import { getCallDetailApi, exportCallDetailApi, exportCallDetailByIdsApi } from '@/api/comp-api'

export default {
  name: 'call-list',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const total = ref(0)
    const searchForm = reactive({
      pageNum: 1,
      pageSize: 10,
      deptName: null,
      serviceId: undefined
    })

    const dataList = ref([])

    const dataListLoading = ref(false)
    const tableRef = ref('')
    const getDataListHandle = (page = { pageNum: 1, pageSize: 10 }) => {
      dataListLoading.value = true
      searchForm.serviceId = props.id
      getCallDetailApi(Object.assign(searchForm, page)).then(({ data }) => {
        const { list, total: count } = data
        total.value = count
        dataList.value = list
      }).finally(() => {
        tableRef.value.clearSelection()
        dataListLoading.value = false
      })
    }
    getDataListHandle()

    const searchFormRef = ref()
    const resetSearchFormHandle = () => {
      searchFormRef.value.resetFields()
      getDataListHandle()
    }

    const selectedList = ref([])
    const selectionChangeHandle = (selectionArray) => {
      selectedList.value = []
      selectionArray.forEach((item) => {
        selectedList.value.push(item.applicationId)
      })
    }

    const exportDataListHandle = () => {
      const tempExportApi = selectedList.value.length ? exportCallDetailByIdsApi : exportCallDetailApi
      tempExportApi(props.id, selectedList.value).then((data) => {
        tableRef.value.clearSelection()
        downloadExport(data)
      })
    }

    return {
      total,
      tableRef,
      dataList,
      searchForm,
      selectedList,
      searchFormRef,
      dataListLoading,

      getDataListHandle,
      exportDataListHandle,
      resetSearchFormHandle,
      selectionChangeHandle
    }
  }
}
</script>

<style scoped lang="scss">
.detail-wrapper {
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 1);

  .table-search {
    display: flex;
    justify-content: space-between;
    padding: 24px;
    border-bottom: 1px solid rgba(245, 248, 250, 1);

    .el-form-item {
      margin-bottom: 0!important;
    }
  }

  .table-operate {
    display: flex;
    justify-content: space-between;
    padding: 16px 24px 24px 24px;
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
