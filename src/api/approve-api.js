import { http, proxyApi } from '@/utils/http'

/**
 * 获取部门审批
 * @param paramsForm
 * @param dataForm
 */
export const getDeptApproveListApi =(paramsForm, dataForm) => http({
  url: `${proxyApi}/serviceApproval/getApplyInfos`,
  method: 'post',
  params: paramsForm,
  data: dataForm
})

/**
 * 获取数据局审批
 * @param paramsForm
 * @param dataForm
 */
export const getDataApproveListApi =(paramsForm, dataForm) => http({
  url: `${proxyApi}/serviceApproval/getAdminApplyInfos`,
  method: 'post',
  params: paramsForm,
  data: dataForm
})

/**
 * 获取审批详情
 * @param dataForm
 */
export const getApproveDetailApi =(dataForm) => http({
  url: `${proxyApi}/serviceApproval/getApplyDetails`,
  method: 'get',
  params: dataForm
})

/**
 * 导出全部部门审批
 * @param dataForm
 */
export const exportApproveListApi =(dataForm) => http({
  url: `${proxyApi}/serviceApproval/exportApplyInfo`,
  method: 'post',
  data: dataForm,
  responseType: 'blob'
})

/**
 * 导出部门审批通过ID
 * @param dataForm
 * @param paramsForm
 */
export const exportApproveListByIdsApi =(paramsForm, dataForm) => http({
  url: `${proxyApi}/serviceApproval/exportApplyInfoByIds`,
  method: 'post',
  data: dataForm,
  params: paramsForm,
  responseType: 'blob'
})
