import { http, proxyApi, proxyApi2, proxyApi3 } from '@/utils/http'

/**
 * 通过Token获取到用户信息
 * @param dataForm
 */
export const ssoLoginByTokenApi = (dataForm) => http({
  url: `${proxyApi3}/zheDingTalk/ssoLogin`,
  method: 'post',
  data: dataForm
})

/**
 * 通过Token登出
 * @param dataForm
 */
export const ssoLogoutApi = (dataForm) => http({
  url: `${proxyApi3}/zheDingTalk/logout`,
  method: 'post',
  data: dataForm
})

/**
 * 用户名密码登录
 * @param dataForm
 * @returns {*}
 */
export const loginApi = (dataForm) => http({
  url: `${ proxyApi }/auth/login`,
  method: 'post',
  params: dataForm
})

/**
 * 获取用户信息
 * @returns {*}
 */
export const getUserApi = () => http({
  url: `${proxyApi}/accountMessage/getUser`,
  method: 'get'
})

/**
 * 获取用户角色信息
 * @param params
 * @returns {*}
 */
export const getUserResourcesApi = (params) => http({
  url: `${proxyApi2}/resourceRole/getRoleResource`,
  method: 'get',
  params
})

/**
 * 用户退出
 * @returns {*}
 */
export const logoutApi = () => http({
  url: `${proxyApi}/accountMessage/exit`,
  method: 'post'
})

/**
 * 验证Ticket获取用户信息
 * @param params
 * @returns {*}
 */
export const validateTicketApi = (params) => http({
  url: `${proxyApi}/user/gateWayTicketValidation`,
  method: 'get',
  params
})
