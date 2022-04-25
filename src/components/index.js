import IconSvg from '@/components/icon-svg.vue'
import BaseUpload from '@/components/base-upload.vue'
import SecondTitle from '@/components/second-title.vue'
import BasePagination from '@/components/base-pagination.vue'

export default (app) => {
  app.component(IconSvg.name, IconSvg)
  app.component(BaseUpload.name, BaseUpload)
  app.component(SecondTitle.name, SecondTitle)
  app.component(BasePagination.name, BasePagination)
}

export { IconSvg, BaseUpload, SecondTitle, BasePagination }
