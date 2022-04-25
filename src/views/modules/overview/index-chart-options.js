export const compCategoryOption = (list = []) => {
  const dataList = []
  list.forEach((item) => {
    dataList.push({ value: item.value, name: item.serviceName })
  })
  return {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      right: '0',
      top: '24%',
      align: 'left',
      icon: 'circle'
    },
    series: [
      {
        type: 'pie',
        radius: '90%',
        left: '-12%',
        top: '32',
        data: dataList,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
}

export const compUpAndDownOption = (list = []) => {
  const xLabelList = []
  const yData1List = []
  const yData2List = []
  list.forEach((item) => {
    xLabelList.push(item.dateStr)
    yData1List.push(item.registryCount)
    yData2List.push(item.removeCount)
  })

  return {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['上架', '下架']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xLabelList
    },
    yAxis: {
      type: 'value',
      interval: 1
    },
    series: [
      {
        name: '上架',
        type: 'line',
        data: yData1List
      },
      {
        name: '下架',
        type: 'line',
        data: yData2List
      }
    ]
  }
}

export const compApplyOption = (list = []) => {
  const xLabelList = []
  const yData1List = []
  const yData2List = []
  list.forEach((item) => {
    xLabelList.push(item.dateStr)
    yData1List.push(item.applyCountAdd)
    yData2List.push(item.callCountAdd)
  })

  return {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['申请', '调用']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xLabelList
    },
    yAxis: {
      type: 'value',
      interval: 1
    },
    series: [
      {
        name: '申请',
        type: 'line',
        data: yData1List
      },
      {
        name: '调用',
        type: 'line',
        data: yData2List
      }
    ]
  }
}
