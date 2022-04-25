<template>
  <el-sub-menu v-if="dataMenu.children && dataMenu.children.length >= 1" :index="dataMenu.id + ''" :key="dataMenu.id" popper-class="site-sidebar--popper">
    <template v-slot:title>
      <icon-svg :name="dataMenu.meta.icon || ''" class="site-sidebar__menu-icon"></icon-svg>
      <span>{{ dataMenu.name }}</span>
    </template>
    <sub-menu v-for="item in dataMenu.children.sort((a, b) => a.sort - b.sort)" :key="item.id" :menuData="item"></sub-menu>
  </el-sub-menu>
  <el-menu-item v-else :index="dataMenu.id + ''" @click="gotoRouteHandle(dataMenu)" :key="dataMenu.id">
    <icon-svg :name="dataMenu.meta.icon || ''" class="site-sidebar__menu-icon"></icon-svg>
    <template v-slot:title>
      <span>{{ dataMenu.name }}</span>
    </template>
  </el-menu-item>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'sub-menu',
  props: {
    menuData: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const dataMenu = Object.assign({ children: [] }, props.menuData)
    const router = useRouter()

    const gotoRouteHandle = ({path}) => {
      router.push({ path })
    }

    return {
      dataMenu,

      gotoRouteHandle
    }
  }
}
</script>
