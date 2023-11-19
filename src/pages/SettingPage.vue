<template>
  <div class="app-setting-main">
    <AppSetting />
    <!-- <Test /> -->
  </div>
</template>

<script setup lang="ts">
// import Loading from "../components/Loading.vue";
// const AppSetting = defineAsyncComponent({
//   loader: async () => import("../components/AppSetting.vue"), // 正常返回
//   loadingComponent: Loading, // SomeComponent未加载完成时 显示loading组件
// });
const appBackground = inject<globalThis.ComputedRef<"#000" | "#fff">>("appBackground");
</script>

<style lang="scss" scoped>
.app-setting-main {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 10px 10px 10px 0;
  background: v-bind(appBackground);
}
</style>
<style lang="scss"></style>
