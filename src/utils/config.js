// 本地开发环境
const devLinkConfig = {
  // 统一登录地址
  unifiedLoginUrl: 'http://auth-center-front.irs.lpxxfw.cn:81',
  // 回调地址
  redirectUrl: 'http://127.0.0.1:3001',
  // 平台Code
  clientId: '2b89893566914c1c84b08bb3562c57eb'
}

// 测试环境
const testLinkConfig = {
  // 统一登录地址
  unifiedLoginUrl: 'http://auth-center-front.irs.lpxxfw.cn:81',
  // 回调地址
  redirectUrl: 'http://10.32.186.227:82',
  // 平台Code
  clientId: '2b89893566914c1c84b08bb3562c57eb'
}

// 正式环境
const prodLinkConfig = {
  // 统一登录地址
  unifiedLoginUrl: 'http://auth-center-front.irs.lpxxfw.cn:81',
  // 回调地址
  redirectUrl: 'http://citydo-gov-market-manage-front.irs.lpxxfw.cn:81',
  // 平台Code
  clientId: '2b89893566914c1c84b08bb3562c57eb'
}

const config = import.meta.env.MODE === 'production' ? prodLinkConfig : (import.meta.env.MODE === 'test' ? testLinkConfig : devLinkConfig)

export default config
