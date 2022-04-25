<template>
  <div class="auth-wrapper">
    <second-title title="授权信息" :show-block="true" :show-border="false"></second-title>
    <div class="table-wrapper">
      <el-table :data="dataList" size="medium">
        <template v-if="!saveReady">
          <el-table-column label="参数名称" prop="paramName">
            <template #default="scope">
              <el-input v-model="scope.row.paramName" placeholder="请输入参数名称"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="参数类型" prop="paramType">
            <template #default="scope">
              <el-select v-model="scope.row.paramType" placeholder="请选择参数类型">
                <el-option v-for="item in paramTypeMap.keys()" :value="item" :label="paramTypeMap.get(item)" :key="item"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="参数回执服务地址" prop="paramReturnAddress">
            <template #default="scope">
              <el-input v-model="scope.row.paramReturnAddress" placeholder="请输入参数回执服务地址"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="参数描述" prop="paramDesc">
            <template #default="scope">
              <el-input v-model="scope.row.paramDesc" placeholder="请输入参数描述"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="测试值" prop="paramTestValue">
            <template #default="scope">
              <el-input v-model="scope.row.paramTestValue" placeholder="请输入测试值"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template #default="scope">
              <el-button @click="deleteOrAddOneHandle(0, scope.$index)" size="small" type="text" style="color: rgb(251, 91, 91);">删除</el-button>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column label="参数名称" prop="paramName"></el-table-column>
          <el-table-column label="参数类型" prop="paramType">
            <template #default="scope">
              {{ paramTypeMap.get(scope.row.paramType) }}
            </template>
          </el-table-column>
          <el-table-column label="参数回执服务地址" prop="paramReturnAddress"></el-table-column>
          <el-table-column label="参数描述" prop="paramDesc"></el-table-column>
          <el-table-column label="测试值" prop="paramTestValue"></el-table-column>
          <el-table-column label="操作" width="80">
            <template #default="scope">
              <el-button @click="() => {scope}" disabled size="small" type="text" style="color: rgb(251, 91, 91);">删除</el-button>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <template v-if="activeStep !==3">
        <div style="display: flex; justify-content: center; padding: 12px 0;">
          <el-button @click="deleteOrAddOneHandle(1)" :disabled="!compId" type="text">
            <el-icon><plus></plus></el-icon>
            新增授权
          </el-button>
          <el-button @click="saveCompAuthHandle" :disabled="!compId || saveReady" type="text">
            <el-icon><circle-check></circle-check></el-icon>
            保存授权
          </el-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { saveCompAuthApi } from '@/api/comp-api'
import { ref } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'auth-form',
  props: {
    compId: {
      required: true
    },
    authList: {
      type: Array,
      required: false,
      default: () => []
    },
    activeStep: {
      type: Number,
      required: true
    }
  },
  emits: ['auth-ready'],
  setup(props, { emit }) {
    const paramTypeMap = new Map([
      [0, '字符串'],
      [1, '数值'],
      [2, '日期']
    ])

    const saveReady = ref(false)
    const dataList = ref(props.authList)
    const saveCompAuthHandle = () => {
      saveCompAuthApi({serviceId: props.compId, serviceAuthorizationInformation: dataList.value }).then(({ data }) => {
        saveReady.value = true
        const { serviceAuthorizationInformation } = data
        dataList.value = serviceAuthorizationInformation
        emit('auth-ready', saveReady.value)
      })
    }

    const validateHandle = () => {
      return cloneDeep(dataList.value)
    }

    const deleteOrAddOneHandle = (type, index = 0) => {
      if (type === 0) {
        dataList.value.splice(index, 1)
      } else {
        saveReady.value = false
        dataList.value.push({
          paramName: undefined,
          paramType: undefined,
          paramDesc: undefined,
          paramTestValue: undefined,
          paramReturnAddress: undefined
        })
      }
    }

    return {
      dataList,
      saveReady,
      paramTypeMap,

      validateHandle,
      saveCompAuthHandle,
      deleteOrAddOneHandle
    }
  }
}
</script>

<style scoped lang="scss">
.auth-wrapper {
  .table-wrapper {
    padding: 0 24px;
  }
}
</style>
