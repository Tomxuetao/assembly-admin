const svgFiles = import.meta.glob('./svg/*.svg')

export const getNameList = () => {
  return Object.keys(svgFiles).map((item) => item.replace('./svg/', '').replace('icon-', '').replace('.svg', ''))
}

