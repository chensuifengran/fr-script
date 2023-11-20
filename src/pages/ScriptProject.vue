<template>
  <div class="script-project">
    <el-empty description="开发中..." />
    <!-- <ScriptProjectList v-show="targetProjectIndex === -1" />
    <AsyncProjectEditor v-show="targetProjectIndex !== -1" /> -->
  </div>
</template>

<script setup lang="ts">
// import Loading from "@renderer/components/Loading.vue";

// const AsyncProjectEditor = defineAsyncComponent({
//   loader: async () => import("@renderer/components/lowCode/ProjectEditor.vue"),
//   loadingComponent: Loading,
// });

// const targetProjectIndex = ref(-1);
// provide("targetProjectIndex", targetProjectIndex);
</script>

<style lang="scss" scoped>
.script-project {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 20px;
  box-sizing: border-box;
}
</style>
