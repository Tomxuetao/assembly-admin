<template>
  <approve-detail :id="id"></approve-detail>
</template>

<script>
import ApproveDetail from './approve-detail.vue'
export default {
  name: 'dept-approve-detail',
  props: {
    id: {
      required: true,
      type: String
    }
  },
  components: { ApproveDetail }
}
</script>

<style scoped>

</style>
