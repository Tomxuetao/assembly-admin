import { http, proxyApi, proxyApi2 } from '@/utils/http'

/**
 * 获取应用列表
 * @param dataForm
 */
export const getAppListApi = (dataForm) => http({
  url: `${proxyApi2}/app/getAllApplicationInfo`,
  method: 'post',
  data: dataForm
})

/**
 * 获取调用列表
 * @param dataForm
 */
export const getCallListApi = (dataForm) => http({
  url: `${proxyApi}/serviceCallStatistics/getServiceCalls`,
  method: 'get',
  params: dataForm
})

/**
 * 导出全部调用列表
 */
export const exportCallListApi = () => http({
  url: `${proxyApi}/serviceCallStatistics/downServiceCalls`,
  method: 'get',
  responseType: 'blob'
})

/**
 *  导出调用列表通过ID
 * @param dataForm
 */
export const exportCallByIdsApi = (dataForm) => http({
  url: `${proxyApi}/serviceCallStatistics/downServiceCallsByIds`,
  method: 'post',
  data: dataForm,
  responseType: 'blob'
})

/**
 * 获取调用详情
 * @param dataForm
 */
export const getCallDetailApi =(dataForm) => http({
  url: `${proxyApi}/serviceCallStatistics/getServiceDetails`,
  method: 'get',
  params: dataForm
})

/**
 * 导出全部调用列表
 * @param serviceId
 */
export const exportCallDetailApi =(serviceId) => http({
  url: `${proxyApi}/serviceCallStatistics/downServiceDetails?serviceId=${serviceId}`,
  method: 'get',
  responseType: 'blob'
})

/**
 * 导出全部调用列表
 * @param serviceId
 * @param dataForm
 */
export const exportCallDetailByIdsApi = (serviceId, dataForm) => http({
  url: `${proxyApi}/serviceCallStatistics/downServiceDetailsByIds?serviceId=${serviceId}`,
  method: 'post',
  data: dataForm,
  responseType: 'blob'
})

/**
 * 获取组件列表
 * @param dataForm
 */
export const getCompListApi = (dataForm) => http({
  url: `${proxyApi}/serviceManage/getServiceList`,
  method: 'post',
  data: dataForm
})

/**
 * 获取已上架组件的告警信息
 * @param dataForm
 */
export const getCompAlarmApi = (dataForm) => http({
  url: `${proxyApi}/historyWarningRecord/selectHistoryWarning`,
  method: 'get',
  params: dataForm
})

/**
 * 获取已上架、已下架组件、获取审批中、被驳回组件基本详情信息
 * @param id
 * @param status ： '0' - 已上架、'1' - ：已下架、'2' - ：审批中、'3' - ：被驳回
 */
export const getCompDetailApi = (id, status = '0') => http({
  url: `${proxyApi}${['0', '1'].includes(status) ? `/serviceInfo/selectServiceInfo?serviceId=${id}` : `/serviceApproval/getApplyDetails?id=${id}`}`,
  method: 'get'
})

/**
 * 获取组件信息,用于下架组件重新上架的流程
 * @param id
 */
export const getServiceDetailApi = ({ id }) => http({
  url: `${proxyApi}/serviceInfo/selectServiceInfo?serviceId=${id}`,
  method: 'get'
})

/**
 * 获取组件信息,用于组件变更的流程
 * @param id
 */
export const getSelectDetailApi = ({ id }) => http({
  url: `${proxyApi}/serviceInfo/selectServiceInfoUpdate?serviceId=${id}`,
  method: 'get'
})

/**
 * 已下架重新上架
 * @param id
 */
export const reRegistryApi = ({ id }) => http({
  url: `${proxyApi}/serviceInfo/serviceReRegistry?id=${id}`,
  method: 'post'
})

/**
 * 获取预警信息
 * @param dataForm
 */
export const getAlertApi = (dataForm) => http({
  url: `${proxyApi}/historyWarningRecord/getWarningMode`,
  method: 'get',
  params: dataForm
})

/**
 * 设置预警信息
 * @param dataForm
 */
export const setAlertApi = (dataForm) => http({
  url: `${proxyApi}/historyWarningRecord/warningTask`,
  method: 'post',
  data: dataForm
})

/**
 * 获取组件的使用信息，用去下架使用
 * @param dataForm
 */
export const getCompUseApi = (dataForm) => http({
  url: `${proxyApi}/serviceManage/getServiceUseInfo`,
  method: 'post',
  params: dataForm
})

export const lowerCompApi = (dataForm) => http({
  url: `${proxyApi}/serviceInfo/serviceRemoved`,
  method: 'post',
  data: dataForm
})

export const getLabelListApi = (dataForm) => http({
  url: `${proxyApi}/serviceInfo/queryByLabel`,
  method: 'get',
  params: dataForm
})

/**
 * 获取已上架、已下架组件接口服务详情信息
 * @param dataForm
 */
export const getCompInterfaceListApi = (dataForm) => http({
  url: `${proxyApi}/serviceInterfaceInfo/selectManager`,
  method: 'get',
  params: dataForm
})

/**
 * 导出组件列表
 * @param dataForm
 */
export const exportCompListApi = (dataForm) => http({
  url: `${proxyApi}${dataForm.idArray ? `/serviceManage/downServiceListByIds?serviceStatus=${dataForm.serviceStatus}` : '/serviceManage/downServiceList'}`,
  method: 'post',
  data: dataForm.idArray ? dataForm.idArray : dataForm,
  responseType: 'blob'
})

/**
 * 获取所有应用列表
 */
export const getAllAppListApi = () => http({
  url: `${proxyApi}/serviceInfo/queryByAllSystem`,
  method: 'get'
})

/**
 * 获取项目信息通过AppId
 * @param dataForm
 */
export const getProByAppIdApi = (dataForm) => http({
  url: `${proxyApi}/serviceInfo/queryProjectBySystem`,
  method: 'get',
  params: dataForm
})

/**
 * 校验组件名称是否存在
 * @param dataForm
 */
export const validateCompNameApi = (dataForm) => http({
  url: `${proxyApi}/serviceInfo/isExist`,
  method: 'get',
  params: dataForm
})

/**
 * 保存基本信息至草稿
 * @param dataForm
 */
export const saveToDraftsApi = (dataForm) => http({
  url: `${proxyApi}/serviceInfo/serviceRegistryDrafts`,
  method: 'post',
  data: dataForm
})

/**
 * 注册组件
 * @param dataForm
 */
export const registryCompApi = (dataForm) => http({
  url: `${proxyApi}/serviceInfo/serviceRegistry`,
  method: 'post',
  data: dataForm
})

/**
 * 更新组件
 * @param dataForm
 */
export const updateCompApi =  (dataForm) => http({
  url: `${proxyApi}/serviceManage/updateServiceInfo`,
  method: 'post',
  data: dataForm
})

/**
 * 保存授权信息
 * @param dataForm
 */
export const saveCompAuthApi = (dataForm) => http({
  url: `${proxyApi}/serviceInfo/saveServiceAuthInfo`,
  method: 'post',
  data: dataForm
})

/**
 * 保存接口信息
 * @param dataForm
 */
export const saveInterfaceApi = (dataForm) => http({
  url: `${proxyApi}/serviceInterfaceInfo/insertInterface?serviceId=${dataForm.serviceId}`,
  method: 'post',
  data: dataForm
})

/**
 * 保存接口信息
 * @param dataForm
 */
export const updateInterfaceApi = (dataForm) => http({
  url: `${proxyApi}/serviceInterfaceInfo/updateInterface`,
  method: 'put',
  data: dataForm
})

/**
 * 获取接口详情
 * @param dataForm
 */
export const getInterfaceDetailApi = (dataForm) => http({
  url: `${proxyApi}/serviceInterfaceInfo/showInterfaceInfo`,
  method: 'post',
  params: dataForm
})

/**
 * 接口调试
 * @param dataForm
 */
export const debugInterfaceApi = (dataForm) => http({
  url: `${proxyApi}/app/debugAPIInterface`,
  method: 'post',
  params: dataForm
})


