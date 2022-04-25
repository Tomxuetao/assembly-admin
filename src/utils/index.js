/**
 * 获取uuid
 */
import { ElMessage } from 'element-plus'

export const getUUID = () => {
  // eslint-disable-next-line no-bitwise
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16))
}

/**
 * 是否有权限
 * @param keyOrKeys
 * @param codeList
 */
export const isAuth = (keyOrKeys, codeList = JSON.parse(sessionStorage.getItem('authorityCodeList') || '[]')) => {
  if (Array.isArray(keyOrKeys)) {
    return keyOrKeys.map((key) => codeList.includes(key)).includes(true)
  }
  return codeList.includes(keyOrKeys)
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export const treeDataTranslate = (data, id = 'id', pid = 'parentId') => {
  const res = []
  const temp = {}
  for (let i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (let k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]].children) {
        temp[data[k][pid]].children = []
      }
      if (!temp[data[k][pid]].level) {
        temp[data[k][pid]].level = 1
      }
      data[k].level = temp[data[k][pid]].level + 1
      temp[data[k][pid]].children.push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

/**
 * 下载导出文件
 * @param data
 * @param downloadMethod
 */
export const downloadExport =({ data, downloadMethod }) => {
  if (downloadMethod && downloadMethod.includes('=')) {
    const aDom = document.createElement('a')
    const tempArray = downloadMethod.split('=')
    aDom.download = decodeURI(tempArray[tempArray.length - 1])
    aDom.href = URL.createObjectURL(new Blob([data], { type: 'charset=utf-8' }))
    aDom.click()
  } else {
    ElMessage.error('下载文件失败')
  }
}

/**
 * 下载文件
 * @param fileUrl
 * @param fileName
 */
export const downloadFileByUrl = (fileUrl, fileName='') => {
  const link = document.createElement('a')
  link.style.display = 'none'
  link.setAttribute('href', `${fileUrl}?response-content-type=application/octet-stream`)
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const isObject = (value) => value !== null && typeof value === 'object'

export const toThousands = (value) => (value || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
