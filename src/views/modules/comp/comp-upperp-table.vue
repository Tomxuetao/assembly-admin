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
      <el-table-column label="归属部门" prop="deptName" width="240" show-overflow-tooltip></el-table-column>
      <el-table-column label="上架时间" prop="releaseTime" width="180" sortable="custom"></el-table-column>
      <el-table-column label="更新时间" prop="modifyTime" width="180"></el-table-column>
      <el-table-column v-if="$isAuth(['comp:comp:detail', 'comp:comp:down', 'comp:comp:update', 'comp:comp:warn', 'comp:comp:setting'])" label="操作" align="center" width="320">
        <template #default="scope">
          <el-button v-if="$isAuth('comp:comp:detail')" type="text" size="small" @click="gotoDetailHandle(scope.row)">详情</el-button>
          <el-button v-if="$isAuth('comp:comp:down')" type="text" size="small" @click="showLowerCompHandle(scope.row)">下架</el-button>
          <el-button v-if="$isAuth('comp:comp:update')" type="text" size="small" @click="gotoUpdateHandle(scope.row)">变更</el-button>
          <el-button v-if="$isAuth('comp:comp:warn')" type="text" size="small" @click="gotoAlarmHandle(scope.row)">告警信息</el-button>
          <el-button v-if="$isAuth('comp:comp:setting')" type="text" size="small"  @click="showAlertSettingHandle(scope.row)">预警设置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-wrapper">
      <base-pagination :page="searchForm" :total="total" :getDataList="getDataListHandle"></base-pagination>
    </div>
    <lower-comp-dialog ref="lowerCompRef"></lower-comp-dialog>
    <alert-setting-dialog ref="alertSettingRef"></alert-setting-dialog>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { downloadExport } from '@/utils'
import { useRouter } from 'vue-router'
import { getCompListApi, exportCompListApi, reRegistryApi, getCompUseApi } from '@/api/comp-api'
import LowerCompDialog from '@/views/modules/comp/lower-comp-dialog.vue'
import AlertSettingDialog from '@/views/modules/comp/alert-setting-dialog.vue'
import { ElMessageBox } from 'element-plus'
export default {
  name: 'comp-upper-table',
  components: { LowerCompDialog, AlertSettingDialog },
  setup() {
    const searchForm = reactive({
      serviceStatus: 0,
      queryName: undefined,
      deptName: undefined,
      sortName: 'releaseTime',
      sortType: 'DESC',
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
      router.push({ name: 'comp-detail', query: { id, status: 0 }})
    }

    const gotoAlarmHandle = ({ id }) => {
      router.push({ name: 'comp-alarm-list', query: { serviceId: id }})
    }

    const gotoUpdateHandle = ({ id, serviceMode }) => {
      getCompUseApi({ serviceId: id }).then(({ data }) => {
        const { count } = data
        ElMessageBox.confirm('', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning',
          title: '请确认是否发起组件变更',
          message: `变更应用组件可能会给使用者带来很大的影响，请谨慎操作。变更操作根据内容的不同，会对应不同的审批流程。<div style="color: rgb(255, 88, 76); padding-top: 12px;">当前共有${count}个应用系统在使用该组件</div>`
        }).then(() => {
          router.push({ name: 'release-index', query: { id, type: 'change', mode: serviceMode } })
        })
      })

    }

    const alertSettingRef = ref()
    const showAlertSettingHandle = ({ id, systemCode }) => {
      alertSettingRef.value.initDialogHandle({
        serviceId: id,
        appId: systemCode
      })
    }

    const lowerCompRef = ref()
    const showLowerCompHandle = ({ id }) => {
      lowerCompRef.value.initDialogHandle(id)
    }

    return {
      total,
      dataList,
      searchForm,
      lowerCompRef,
      searchFormRef,
      alertSettingRef,
      dataListLoading,

      gotoAlarmHandle,
      gotoUpdateHandle,
      gotoDetailHandle,
      getDataListHandle,
      showLowerCompHandle,
      dataSortChangeHandle,
      exportDataListHandle,
      restSearchFormHandle,
      selectionChangeHandle,
      showAlertSettingHandle
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
