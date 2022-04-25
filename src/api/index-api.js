import { http, proxyApi } from '@/utils/http'

/**
 * 获取首页各指标数量
 * @param dataForm
 */
export const getOverviewApi = (dataForm) => http({
  url: `${proxyApi}/serviceOverview/serviceCount`,
  method: 'get',
  params: dataForm
})

/**
 * 获取组件分类
 * @param dataForm
 */
export const getCategoryApi = (dataForm) => http({
  url: `${proxyApi}/serviceOverview/getServiceCategoryRate`,
  method: 'get',
  params: dataForm
})

/**
 * 获取上下架
 * @param dataForm
 */
export const getUpAndDownApi = (dataForm) => http({
  url: `${proxyApi}/serviceOverview/getServiceOnAndOffCount`,
  method: 'get',
  params: dataForm
})

/**
 * 获取组件调用量
 * @param dataForm
 */
export const getCompApplyApi = (dataForm) => http({
  url: `${proxyApi}serviceOverview/getServiceApplyAndUse`,
  method: 'get',
  params: dataForm
})


