<template>
  <div class="auth-wrapper">
    <second-title title="授权信息" :show-block="true" :show-border="false"></second-title>
    <div class="table-wrapper">
      <el-table :data="list">
        <el-table-column label="参数名" prop="paramName"></el-table-column>
        <el-table-column label="参数类型" prop="paramType">
          <template #default="scope">{{ paramTypeMap.get(scope.row.paramType) }}</template>
        </el-table-column>
        <el-table-column label="参数回执服务地址" prop="paramReturnAddress"></el-table-column>
        <el-table-column label="参数描述" prop="paramDesc"></el-table-column>
        <el-table-column label="测试值" prop="paramTestValue"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'auth-detail',
  props: {
    list: {
      required: true,
      type: Array,
      default: () => []
    }
  },
  setup() {
    const paramTypeMap = new Map([
      [0, '字符串'],
      [1, '数值'],
      [2, '日期']
    ])

    return {
      paramTypeMap
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
