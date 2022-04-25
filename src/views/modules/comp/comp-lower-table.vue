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
    <el-table row-key="id" :data="dataList" @selection-change="selectionChangeHandle" @sort-change="dataSortChangeHandle" ref="tableRef" v-loading="dataListLoading" height="715" style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="组件名称" prop="serviceName" show-overflow-tooltip></el-table-column>
      <el-table-column label="归属应用" prop="systemName" show-overflow-tooltip></el-table-column>
      <el-table-column label="归属部门" prop="deptName" width="180"></el-table-column>
      <el-table-column label="上架时间" prop="releaseTime" sortable="custom" width="180"></el-table-column>
      <el-table-column label="审批时间" prop="approvalTime" width="180"></el-table-column>
      <el-table-column label="下架时间" prop="offShelfTime" width="180"></el-table-column>
      <el-table-column v-if="$isAuth(['comp:comp:detail', 'comp:comp:reshelf'])" label="操作" align="center" width="160">
        <template #default="scope">
          <el-button v-if="$isAuth('comp:comp:detail')" type="text" size="small" @click="gotoDetailHandle(scope.row)">详情</el-button>
          <el-button v-if="$isAuth('comp:comp:reshelf')" type="text" size="small" @click="reRegistryHandle(scope.row)">重新上架</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-wrapper">
      <base-pagination :page="searchForm" :total="total" :getDataList="getDataListHandle"></base-pagination>
    </div>
  </div>
</template>

<script>
import { getCompListApi, exportCompListApi, reRegistryApi } from '@/api/comp-api'
import { reactive, ref } from 'vue'
import { downloadExport } from '@/utils'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
export default {
  name: 'comp-lower-table',
  setup() {
    const searchForm = reactive({
      serviceStatus: 1,
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
        case 'releaseTime': {
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
    const gotoDetailHandle = ({ id }) => {
      router.push({ name: 'comp-detail', query: { id, status: 1 }})
    }

    const reRegistryHandle = ({ id }) => {
      ElMessageBox.confirm('重新上架系统将以该组件上架时期的信息为基础，自动生成上架申请单并进入上架审批流程。','请确认是否要重新上架您的应用', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        reRegistryApi({ id }).then(() => {
          getDataListHandle()
        })
      })
    }

    return {
      total,
      dataList,
      searchForm,
      searchFormRef,
      dataListLoading,

      reRegistryHandle,
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
