<template>
  <div class="table-wrapper">
    <div class="table-operate">
      <div v-if="$isAuth('comp:comp:export')" style="margin-top: 4px;">
        <el-button @click="exportDataListHandle()" size="default" style="width: 88px">导出</el-button>
      </div>
      <div>
        <el-form :model="searchForm" :inline="true" ref="searchFormRef" class="search-form">
          <el-form-item prop="queryName" label="关键字" style="margin-right: 32px;">
            <el-input v-model="searchForm.queryName" placeholder="请输入组件名称或应用名称" style="width: 260px;"></el-input>
          </el-form-item>
          <el-form-item prop="deptName" label="所属部门" style="margin-right: 32px;">
            <el-input v-model="searchForm.deptName" placeholder="请输入所属部门" style="width: 260px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="restSearchFormHandle()" style="width: 88px">重置</el-button>
            <el-button @click="getDataListHandle()" type="primary" style="width: 88px">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table row-key="applyId" :data="dataList" @selection-change="selectionChangeHandle" @sort-change="dataSortChangeHandle" ref="tableRef" v-loading="dataListLoading" height="715" style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="组件名称" prop="serviceName" show-overflow-tooltip width="320"></el-table-column>
      <el-table-column label="审批类型" prop="applyType" show-overflow-tooltip width="160">
        <template #default="scope">{{ applyTypeMap.get(scope.row.applyType) }}</template>
      </el-table-column>
      <el-table-column label="申请人" prop="deptName"></el-table-column>
      <el-table-column label="申请时间" prop="applyTime" sortable="custom" width="180"></el-table-column>
      <el-table-column label="审批状态" prop="applyStatusStr" width="200"></el-table-column>
      <el-table-column v-if="$isAuth('comp:comp:detail')" label="操作" align="center" width="80">
        <template #default="scope">
          <el-button @click="gotoDetailHandle(scope.row)" type="text" size="small" >详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-wrapper">
      <base-pagination :page="searchForm" :total="total" :getDataList="getDataListHandle"></base-pagination>
    </div>
  </div>
</template>

<script>
import { getCompListApi, exportCompListApi } from '@/api/comp-api'
import { reactive, ref } from 'vue'
import { downloadExport } from '@/utils'
import { useRouter } from 'vue-router'

export default {
  name: 'comp-approve-table',
  setup() {
    const applyTypeMap = new Map([
      [0, '使用审批'],
      [2, '上架审批'],
      [4, '下架审批'],
      [5, '变更审批']
    ])
    const searchForm = reactive({
      serviceStatus: 2,
      queryName: undefined,
      deptName: undefined,
      pageNum: 1,
      pageSize: 10
    })

    const total = ref(0)
    const dataList = ref([])
    const dataListLoading = ref(false)

    const getDataListHandle = (page = { pageNum: 1, pageSize: 10 }) => {
      dataListLoading.value = true
      getCompListApi(Object.assign(searchForm, page)).then(({ data }) => {
        const { list, total: count } = data
        dataList.value = list
        total.value = count
      }).finally(() => {
        dataListLoading.value = false
      })
    }
    getDataListHandle()

    const searchFormRef = ref()
    const restSearchFormHandle = () => {
      searchFormRef.value.resetFields()
      getDataListHandle()
    }

    const selectionIdList = ref([])
    const selectionChangeHandle = (selection) => {
      selectionIdList.value = []
      const tempIdList = []
      selection.forEach((item) => {
        tempIdList.push(item.id)
      })
      selectionIdList.value = tempIdList
    }

    const dataSortChangeHandle = ({ prop, order }) => {
      switch (prop) {
        case 'applyTime': {
          if (order) {
            if (order === 'descending') {
              searchForm.sortType = 'DESC'
            } else {
              searchForm.sortType = 'ASC'
            }
            getDataListHandle()
          }
          break
        }
        default: {
          break
        }
      }
    }

    const exportDataListHandle = () => {
      const dataForm = Object.assign(searchForm, { idArray: selectionIdList.value.length ? selectionIdList.value : undefined })
      exportCompListApi(dataForm).then((data) => {
        downloadExport(data)
      })
    }

    const router = useRouter()
    const gotoDetailHandle = ({ applyId }) => {
      router.push({ name: 'comp-detail', query: { id: applyId, status: 2 }})
    }

    return {
      total,
      dataList,
      searchForm,
      applyTypeMap,
      searchFormRef,
      dataListLoading,

      gotoDetailHandle,
      getDataListHandle,
      dataSortChangeHandle,
      exportDataListHandle,
      restSearchFormHandle,
      selectionChangeHandle
    }
  }
}
</script>

<style scoped lang="scss">
.table-wrapper {
  padding: 24px;

  .table-operate {
    display: flex;
    justify-content: space-between;
  }

  .page-wrapper {
    display: flex;
    justify-content: flex-end;
    padding-top: 24px;
  }
}
</style>
