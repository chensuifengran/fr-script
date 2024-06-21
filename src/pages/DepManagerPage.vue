<template>
  <div class="app-setting-dep-manager">
    <div class="title-bar" data-tauri-drag-region style="cursor: move">
      <div class="title" data-tauri-drag-region style="cursor: move">依赖管理</div>
      <el-button class="close" @click="_close" link size="large"><el-icon>
          <span i-mdi-close></span>
        </el-icon></el-button>
    </div>
    <AsyncDepManager class="dep-manager-content" />
  </div>
</template>
<script lang="ts" setup>
import Loading from "../components/Loading.vue";
const AsyncDepManager = defineAsyncComponent({
  loader: () => import("../components/dependence/DepManager.vue"),
  loadingComponent: Loading,
})
const { appBackground, appAsideBgColor } = useAppTheme();
const { syncMainData, close } = useDepInfo();
const _close = () => {
  syncMainData();
  close();
}
</script>

<style lang="scss" scoped>
.app-setting-dep-manager {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 10px 10px 10px 0;
  background: v-bind(appBackground);

  .dep-manager-content {
    padding: 0px 10px 20px 10px;
    box-sizing: border-box;
    height: calc(100% - 35px);
  }

  .title-bar {
    display: flex;
    justify-content: space-between;
    padding: 5px 10px;
    align-items: center;
    background-color: v-bind(appAsideBgColor);
    height: 35px;
  }
}
</style>