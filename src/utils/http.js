import axios from 'axios'
import { ElMessage } from 'element-plus'
import config from '@/utils/config'

export function createHttp() {
  const http = axios.create({
    timeout: 1000 * 60,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })

  /**
   * 请求拦截
   */
  http.interceptors.request.use((config) => {
    const tempHeaders = {
      token: sessionStorage.getItem('token'),
      Authorization: sessionStorage.getItem('token'),
      userId: sessionStorage.getItem('userId') || '',
      roleId: sessionStorage.getItem('roleId') || '',
      accountNum: sessionStorage.getItem('accountNum') || undefined,
      accountName: encodeURIComponent(sessionStorage.getItem('accountName') || '')
    }
    config.headers = Object.assign(config.headers, tempHeaders)
    return config
  }, (error) => Promise.reject(error))

  /**
   * 响应拦截
   */
  http.interceptors.response.use((response) => {
    const { data, request, headers } = response
    const { code, message } = data
    const codeNum = Number(code)
    // 401-token失效、70004-未登录
    if ([401, 70004, 80002].includes(codeNum)) {
      sessionStorage.clear()
      sessionStorage.clear()
      ElMessage.error(message)
      window.location.href = `${ config.unifiedLoginUrl }/login?clientId=${ config.clientId }&redirect_uri=${ config.redirectUrl }`
    }
    if ([500, 10001].includes(codeNum) || codeNum > 70000) {
      ElMessage.error(message)
      if (message.includes('请先登录')) {
        sessionStorage.clear()
        sessionStorage.clear()
        window.location.href = `${ config.unifiedLoginUrl }/login?clientId=${ config.clientId }&redirect_uri=${ config.redirectUrl }`
      }
      return Promise.reject(new Error(message))
    }
    if (request.responseType !== 'blob') {
      return data
    }
    // 针对附件导出的拦截
    return { downloadMethod: headers['content-disposition'], data }
  }, (error) => {
    const responseMsg = error.response.data.message
    ElMessage.error(responseMsg)
    // 未登录
    if (responseMsg.includes('70004')) {
      sessionStorage.clear()
      sessionStorage.clear()
      window.location.href = `${ config.unifiedLoginUrl }/login?clientId=${ config.clientId }&redirect_uri=${ config.redirectUrl }`
    }
    return Promise.reject(error)
  })
  return http
}

export const proxyApi = '/proxyMainApi'
export const proxyApi2 = '/proxyConfigApi'
export const proxyApi3 = '/proxyGatewayApi'

export const http = createHttp()
