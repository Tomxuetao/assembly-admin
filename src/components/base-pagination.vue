<template>
  <el-pagination
    :total="total"
    :layout="layout"
    :page-size="page.pageSize"
    :page-sizes="pageSizes"
    :background="background"
    :current-page="page.pageNum || page.current"
    @size-change="pageSizeChange"
    @current-change="pageNumChange">
  </el-pagination>
</template>

<script>
export default {
  name: 'base-pagination',
  props: {
    total: {
      type: Number,
      default: 0,
      required: true
    },
    page: {
      type: Object,
      default: () => {
        return {
          current: 1,
          pageNum: 1,
          pageSize: 10
        }
      },
      required: true
    },
    layout: {
      type: String,
      required: false,
      default: 'total, prev, pager, next, sizes'
    },
    pageSizes: {
      type: Array,
      required: false,
      default: () => [10, 20, 50, 100]
    },
    background: {
      type: Boolean,
      required: false,
      default: true
    },
    getDataList: {
      type: Function,
      required: true,
      default: () => {
        return () => {}
      }
    }
  },

  setup(props) {
    /**
     * 分页页码改变
     * @param pageNum
     */
    const pageNumChange = (pageNum) => {
      if (props.page.pageNum) {
        props.getDataList({
          pageNum: pageNum
        })
      } else {
        props.getDataList({
          current: pageNum
        })
      }
    }

    /**
     * 分页条数改变
     * @param pageSize
     */
    const pageSizeChange = (pageSize) => {
      if (props.page.pageNum) {
        props.getDataList({
          pageNum: pageNum,
          pageSize: pageSize
        })
      } else {
        props.getDataList({
          current: pageNum,
          pageSize: pageSize
        })
      }
    }

    return {
      pageNumChange,
      pageSizeChange
    }
  }
}
</script>
