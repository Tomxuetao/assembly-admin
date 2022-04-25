<template>
  <div class="title-wrapper" :class="[showBorder ? '' : 'none-border']">
    <div v-if="showBlock" class="title-block"></div>
    <div class="content-wrapper">
      <div class="title-text">
        <span>{{ title }}</span>
      </div>
      <div>
        <slot name="operate"></slot>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'second-title',
  props: {
    title: {
      type: String,
      required: true
    },
    showBlock: {
      type: Boolean,
      required: false,
      default: false
    },
    showBorder: {
      type: Boolean,
      required: false,
      default: true
    }
  }
}
</script>

<style scoped lang="scss">
.title-wrapper {
  display: flex;
  height: 59px;
  line-height: 59px;
  padding: 0 24px 0 0;
  border-bottom: 1px solid rgba(245, 248, 250, 1);

  .title-block {
    width: 4px;
    height: 20px;
    margin-top: 20px;
    background-color: rgba(20, 146, 255, 1);
  }

  .content-wrapper {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .title-text {
      padding-left: 24px;
      font-size: 18px;
      font-weight: 600;
      color: rgba(51, 51, 51, 1);
    }
  }
}

.none-border {
  height: 60px;
  line-height: 60px;
  border-bottom: none;
}
</style>
