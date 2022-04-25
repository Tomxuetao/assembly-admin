<template>
  <div class="approve-wrapper">
    <div class="tab-wrapper">
      <div v-for="(item, index) in headerList" @click="changeActiveHandle(item.status)" :key="index" class="tab-item" :class="[activeStatus === item.status ? 'active-item' : '']">
        <div class="item-title">{{ item.title }}</div>
        <div class="item-bar"></div>
      </div>
    </div>
    <div class="table-search">
      <el-form :model="searchForm" :inline="true" ref="searchFormRef" class="search-form">
        <el-form-item label="组件名称" prop="serviceName">
          <el-input v-model="searchForm.serviceName" placeholder="请输入组件名称" style="width: 280px;"></el-input>
        </el-form-item>
        <el-form-item label="归属应用" prop="applicationName">
          <el-input v-model="searchForm.applicationName" placeholder="请输入归属应用" style="width: 280px;"></el-input>
        </el-form-item>
        <el-form-item label="申请部门" prop="applyDeptName">
          <el-input v-model="searchForm.applyDeptName" placeholder="请输入归属部门" style="width: 280px;"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="resetSearchFormHandle()" style="width: 116px;">重 置</el-button>
        <el-button type="primary" @click="getDataListHandle()" style="width: 116px;">查 询</el-button>
      </div>
    </div>
    <div class="table-operate">
      <div>
        <el-button v-if="$isAuth('approve:data:export')" size="default" @click="exportDataListHandle()" style="width: 88px; margin: 0;">导 出</el-button>
      </div>
    </div>
    <div class="table-content">
      <el-table :data="dataList" ref="tableRef" row-key="id" @selection-change="selectionChangeHandle" v-loading="dataListLoading" height="650">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="组件名称" prop="serviceName" show-overflow-tooltip></el-table-column>
        <el-table-column label="归属应用" prop="applicationName" show-overflow-tooltip></el-table-column>
        <el-table-column label="申请类型" prop="applyType" width="120">
          <template #default="scope">
            {{ applyTypeMap.get(scope.row.applyType) }}
          </template>
        </el-table-column>
        <el-table-column label="申请人" prop="applyDeptName" width="240" show-overflow-tooltip></el-table-column>
        <el-table-column label="申请时间" prop="applyTime" width="180"></el-table-column>
        <el-table-column label="审批状态" prop="rsApprovalStatus" width="120">
          <template #default="scope">
            <template v-if="scope.row.rsApprovalStatus === 0">待审批</template>
            <template v-else>
              <el-tooltip placement="top" :content="`${scope.row.rsApproverName} ${scope.row.rsApprovalTime}`">
                <span>已审批</span>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
        <template v-if="activeStatus !== 0">
          <el-table-column label="审批结果" prop="rsApprovalResult">
            <template #default="scope">{{ scope.row.rsApprovalResult === 1 ? '已通过' : (scope.row.rsApprovalResult === 0 ? '驳回' : '暂未审批') }}</template>
          </el-table-column>
        </template>
        <el-table-column v-if="$isAuth('approve:data:detail')" label="操作" width="80">
          <template #default="scope">
            <el-button type="text" size="small" @click="router.push({ name: 'approve-data-detail', query: { id: scope.row.id } })">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-wrapper">
      <base-pagination :page="paramsForm" :total="total" :getDataList="getDataListHandle"></base-pagination>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { downloadExport } from '@/utils'
import { getDataApproveListApi, exportApproveListApi, exportApproveListByIdsApi } from '@/api/approve-api'
import { useRouter } from 'vue-router'

export default {
  name: 'data-approve',
  setup() {
    const router = useRouter()
    const total = ref(0)
    const paramsForm = reactive({
      pageNum: 1,
      pageSize: 10,
      sortName: 'applyTime',
      sortType: 'DESC'
    })
    const activeStatus = ref(99)
    const searchForm = reactive({
      serviceName: undefined,
      applyDeptName: undefined,
      applicationName: undefined
    })

    const headerList = [
      { title: '全部审批', status: 99 },
      { title: '待审批', status: 0 },
      { title: '已审批', status: 1 }
    ]

    const applyTypeMap = new Map([
      [0, '使用申请'],
      [2, '上架申请'],
      [4, '下架申请'],
      [5, '变更申请']
    ])

    const dataList = ref([])

    const dataListLoading = ref(false)
    const tableRef = ref()
    const getDataListHandle = (page = { pageNum: 1, pageSize: 10 }) => {
      dataListLoading.value = true
      searchForm.rsApprovalStatus = activeStatus.value
      getDataApproveListApi(Object.assign(paramsForm, page), searchForm).then(({ data }) => {
        const { list, total: count } = data
        total.value = count
        dataList.value = list
        dataListLoading.value = false
      }).finally(() => {
        tableRef.value.clearSelection()
        dataListLoading.value = false
      })
    }
    getDataListHandle()

    const changeActiveHandle = (status) => {
      paramsForm.pageNum = 1
      paramsForm.pageSize = 10
      activeStatus.value = status
      getDataListHandle()
    }

    const searchFormRef = ref()
    const resetSearchFormHandle = () => {
      searchFormRef.value.resetFields()
      getDataListHandle()
    }

    const selectedList = ref([])
    const selectionChangeHandle = (selectionArray) => {
      selectedList.value = []
      selectionArray.forEach((item) => {
        selectedList.value.push(item.id)
      })
    }

    const exportDataListHandle = () => {
      const selectedLen = selectedList.value.length
      const tempExportApi = selectedLen ? exportApproveListByIdsApi : exportApproveListApi
      const dataForm = selectedLen ? { queryType: 1 } : { approvalStatus: activeStatus.value, queryType: 1 }

      tempExportApi(dataForm, selectedList.value).then((data) => {
        tableRef.value.clearSelection()
        downloadExport(data)
      })
    }


    return {
      total,
      router,
      tableRef,
      dataList,
      headerList,
      paramsForm,
      searchForm,
      selectedList,
      applyTypeMap,
      activeStatus,
      searchFormRef,
      dataListLoading,

      getDataListHandle,
      changeActiveHandle,
      exportDataListHandle,
      resetSearchFormHandle,
      selectionChangeHandle
    }
  }
}
</script>

<style scoped lang="scss">
.approve-wrapper {
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 1);

  .tab-wrapper {
    display: flex;
    height: 60px;
    line-height: 60px;
    padding: 0 24px;
    border-bottom: 1px solid #f5f8fa;

    .tab-item {
      height: 57px;
      line-height: 57px;
      margin-right: 40px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
      font-family: PingFangSC-Semibold;
    }

    .active-item {
      .item-title {
        color: rgba(77, 135, 255, 1);
      }

      .item-bar {
        height: 3px;
        border-radius: 2px 2px 0 0;
        background-color: rgba(77, 135, 255, 1);
      }
    }
  }

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
