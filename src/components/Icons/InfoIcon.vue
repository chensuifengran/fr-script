<template>
  <el-icon :size="size"><span i-mdi-information-slab-circle-outline></span></el-icon>
</template>
<script lang="ts" setup>
defineProps({
  size: {
    type: String,
    default: "large"
  }
})
</script>

<style lang="scss" scoped></style>