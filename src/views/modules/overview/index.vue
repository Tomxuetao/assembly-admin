<template>
  <div class="site-container">
    <div class="header-wrapper">
      <div class="header-title">
        <div class="service-title">服务发布情况</div>
        <div class="use-title">服务使用情况</div>
      </div>
      <div class="header-content">
        <div class="content-item" v-for="(item, index) in headerList" :key="index">
          <icon-svg :name="item.icon" class="icon-svg"></icon-svg>
          <div class="item-wrapper">
            <div class="text-num" :style="{color: item.color}">{{ item.num }}</div>
            <div class="text-title">{{ item.title }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-wrapper">
      <div class="comp-wrapper">
        <div class="comp-category">
          <div class="category-title">应用组件分类</div>
          <div class="category-chart" id="categoryChartRef"></div>
        </div>
        <div class="comp-updown">
          <div class="updown-title">应用组件上下架</div>
          <div class="updown-chart" id="upAndDownChartRef"></div>
        </div>
      </div>
      <div class="apply-wrapper">
        <div class="apply-title">应用组件申请调用</div>
        <div class="apply-chart" id="applyChartRef"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getOverviewApi, getCategoryApi, getUpAndDownApi, getCompApplyApi } from '@/api/index-api'
import { toThousands } from '@/utils'
import { compCategoryOption, compUpAndDownOption, compApplyOption } from '@/views/modules/overview/index-chart-options'
import { useStore } from 'vuex'

export default {
  name: 'index',
  setup() {
    const store = useStore()
    const sidebarFoldComputed = computed({
      get: () => {
        return store.state.common.sidebarFold
      },
      set: value => {
        store.commit('common/updateSidebarFold', value)
      }
    })

    const headerList = ref([
      { title: '系统个数' , icon: 'sys', num: 0, prop: 'sysNum', color: 'rgba(255, 159, 13, 1)' },
      { title: '服务组件个数' , icon: 'service', num: 0, prop: 'serviceNum', color: 'rgba(255, 159, 13, 1)' },
      { title: '服务申请（次）' , icon: 'apply', num: 0, prop: 'applyNum', color: 'rgba(115, 92, 230, 1)' },
      { title: '服务部门（个）' , icon: 'dept', num: 0, prop: 'DeptNum', color: 'rgba(115, 92, 230, 1)' },
      { title: '服务调用（次）' , icon: 'call', num: 0, prop: 'invocation', color: 'rgba(115, 92, 230, 1)' }
    ])

    const getHeaderDetailHandle = () => {
      getOverviewApi().then(({ data }) => {
        headerList.value.forEach((item) => {
          item.num = toThousands(data[item.prop])
        })
      })
    }
    getHeaderDetailHandle()

    let applyChart
    let categoryChart
    let upAndDownChart
    const initChartHandle = () => {
      applyChart = echarts.init(document.getElementById('applyChartRef'))
      categoryChart = echarts.init(document.getElementById('categoryChartRef'))
      upAndDownChart = echarts.init(document.getElementById('upAndDownChartRef'))
      getCategoryHandle()
      getUpAndDownHandle()
      getCompApplyHandle()
    }

    onMounted(() => {
      nextTick(()=> {
        initChartHandle()
      })
    })

    const getCategoryHandle = () => {
      getCategoryApi().then(({ data }) => {
        const { list } = data
        categoryChart.setOption(compCategoryOption(list))
      })
    }

    const getUpAndDownHandle = (type = 0) => {
      getUpAndDownApi({ type }).then(({ data }) => {
        upAndDownChart.setOption(compUpAndDownOption(data))
      })
    }

    const getCompApplyHandle = (type = 0) => {
      getCompApplyApi({ type }).then(({ data }) => {
        applyChart.setOption(compApplyOption(data))
      })
    }

    let timer = null
    const resizeOption = {
      animation: { duration: 2000, easing: 'linear'}
    }
    watch(() => sidebarFoldComputed.value, () => {
      timer = setTimeout(() => {
        applyChart.resize(resizeOption)
        categoryChart.resize(resizeOption)
        upAndDownChart.resize(resizeOption)
      }, 500)
    })

    onBeforeUnmount(() => {
      if (timer) {
        clearTimeout(timer)
      }
    })

    return {
      headerList
    }
  }
}
</script>

<style scoped lang="scss">
.site-container {
  height: calc(100vh - 108px);

  .header-wrapper {
    margin-right: -24px;

    .header-title {
      display: flex;
      padding-bottom: 24px;
      color: rgba(114, 119, 127, 1);
      font-size: 16px;
      line-height: 16px;
      font-weight: 500;
      font-family: PingFangSC-Medium, PingFang SC;

      .service-title {
        flex: 2;
      }

      .use-title {
        flex: 3;
      }
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      .content-item {
        display: flex;
        align-content: center;
        align-items: center;
        width: 20%;
        padding: 20px 24px;
        margin-right: 24px;
        height: 100px;
        background: rgba(255, 255, 255, 1);
        border-radius: 12px;
        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.02);

        .icon-svg {
          display: inline-block;
          height: 32px;
          width: 32px;
          font-size: 32px;
          margin-right: 12px;
        }

        .item-wrapper {
          .text-num {
            margin-bottom: 8px;
            font-size: 36px;
            line-height: 36px;
            font-weight: normal;
            font-family: DIN-BoldItalic;
          }

          .text-title {
            color: rgba(102, 102, 102, 1);
            font-size: 14px;
            line-height: 14px;
            font-weight: 500;
            font-family: PingFangSC-Medium, PingFang SC;
          }
        }
      }
    }
  }

  .chart-wrapper {
    height: calc(100vh - 272px);
    margin-top: 24px;

    .comp-wrapper {
      display: flex;
      padding: 24px;
      border-radius: 12px;
      background-color: rgba(255, 255, 255, 1);

      .comp-category {
        flex: 2;

        .category-title {
          color: rgba(51, 51, 51, 1);
          font-size: 18px;
          line-height: 18px;
          font-weight: 600;
          font-family: PingFangSC-Semibold;
        }

        .category-chart {
          width: 100%;
          height: calc((100vh - 272px - 156px) / 2);
        }
      }

      .comp-updown {
        flex: 3;

        .updown-title {
          color: rgba(51, 51, 51, 1);
          font-size: 18px;
          line-height: 18px;
          font-weight: 600;
          font-family: PingFangSC-Semibold;
        }

        .updown-chart {
          width: 100%;
          height: calc((100vh - 272px - 156px) / 2);
        }
      }
    }

    .apply-wrapper {
      padding: 24px;
      margin-top: 24px;
      border-radius: 12px;
      background-color: rgba(255, 255, 255, 1);

      .apply-title {
        color: rgba(51, 51, 51, 1);
        font-size: 18px;
        line-height: 18px;
        font-weight: 600;
        font-family: PingFangSC-Semibold;
      }

      .apply-chart {
        width: 100%;
        height: calc((100vh - 272px - 156px) / 2);
      }
    }

  }
}
</style>
