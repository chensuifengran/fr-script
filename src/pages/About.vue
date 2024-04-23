<template>
  <div class="about-main">
    <el-empty description="开发中..." />
    <!-- <iframe src="http://114.132.79.162/tool/#/index" /> -->
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.about-main {
  width: 100%;
  height: calc(100% - 10px);
  box-sizing: border-box;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  iframe {
    width: 100%;
    height: 100%;
    border: none;
    box-sizing: border-box;
  }
}
</style>
