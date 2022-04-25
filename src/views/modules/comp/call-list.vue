<template>
  <div class="call-wrapper">
    <second-title title="调用统计"></second-title>
    <div class="table-search">
      <el-form :model="searchForm" :inline="true" ref="searchFormRef" class="search-form">
        <el-form-item label="组件名称" prop="queryName">
          <el-input v-model="searchForm.queryName" placeholder="请输入组件名称" style="width: 280px;"></el-input>
        </el-form-item>
        <el-form-item label="归属应用" prop="systemName">
          <el-input v-model="searchForm.systemName" placeholder="请输入归属应用" style="width: 280px;"></el-input>
        </el-form-item>
        <el-form-item label="归属部门" prop="deptName">
          <el-input v-model="searchForm.deptName" placeholder="请输入归属部门" style="width: 280px;"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="resetSearchFormHandle()" style="width: 116px;">重 置</el-button>
        <el-button type="primary" @click="getDataListHandle()" style="width: 116px;">查 询</el-button>
      </div>
    </div>
    <div class="table-operate">
      <div>
        <el-button v-if="$isAuth('comp:call:export')" size="default" @click="exportDataListHandle()" style="width: 88px; margin: 0;">导 出</el-button>
      </div>
    </div>
    <div class="table-content">
      <el-table :data="dataList" ref="tableRef" row-key="serviceId" @selection-change="selectionChangeHandle" v-loading="dataListLoading" height="650">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="组件名称" prop="serviceName" show-overflow-tooltip></el-table-column>
        <el-table-column label="归属应用" prop="proName" show-overflow-tooltip></el-table-column>
        <el-table-column label="归属部门" prop="deptName" show-overflow-tooltip></el-table-column>
        <el-table-column label="发布时间" prop="releaseTime" width="170"></el-table-column>
        <el-table-column label="支撑系统个数" prop="applicationCount" width="140"></el-table-column>
        <el-table-column label="调用总数" prop="invocationNum" width="140"></el-table-column>
        <el-table-column label="成功次数" prop="successNum" width="140"></el-table-column>
        <el-table-column label="失败次数" prop="failNum" width="140"></el-table-column>
        <el-table-column  label="操作" v-if="$isAuth('comp:call:detail')" width="80">
          <template #default="scope">
            <el-button type="text" size="small" :disabled="scope.row.invocationNum <= 0" @click="router.push({ name: 'call-detail', query: { id: scope.row.serviceId } })">详情</el-button>
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
import { reactive, ref } from 'vue'
import { downloadExport } from '@/utils'
import { getCallListApi, exportCallListApi, exportCallByIdsApi } from '@/api/comp-api'
import { useRouter } from 'vue-router'

export default {
  name: 'call-list',
  setup() {
    const router = useRouter()
    const total = ref(0)
    const searchForm = reactive({
      pageNum: 1,
      pageSize: 10,
      sortName: 'successNum',
      sortType: 'DESC',
      deptName: null,
      queryName: null,
      systemName: null
    })

    const dataList = ref([])

    const dataListLoading = ref(false)
    const tableRef = ref()
    const getDataListHandle = (page = { pageNum: 1, pageSize: 10 }) => {
      dataListLoading.value = true
      getCallListApi(Object.assign(searchForm, page)).then(({ data }) => {
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
        selectedList.value.push(item.serviceId)
      })
    }

    const exportDataListHandle = () => {
      const tempExportApi = selectedList.value.length ? exportCallByIdsApi : exportCallListApi
      const dataForm = selectedList.value.length ? selectedList.value : undefined
      tempExportApi(dataForm).then((data) => {
        tableRef.value.clearSelection()
        downloadExport(data)
      })
    }

    return {
      total,
      router,
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
.call-wrapper {
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
