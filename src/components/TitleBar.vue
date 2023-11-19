<template>
  <div data-tauri-drag-region class="titlebar">
    <div class="title">
      <span class="text">风染脚本</span>
    </div>
    <div class="btn">
      <div class="titlebar-button" ref="minimize">
        <el-icon><IEpMinus /></el-icon>
      </div>
      <div class="titlebar-button" ref="maximize">
        <el-icon
          ><IEpFullScreen v-show="!isFullScreen" /><IEpCopyDocument v-show="isFullScreen"
        /></el-icon>
      </div>
      <div class="titlebar-button" ref="close">
        <el-icon><IEpClose /></el-icon>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const isDark = inject<globalThis.WritableComputedRef<boolean>>("isDark")!;
const isFullScreen = ref(false);
const titleBarColor = computed(() => {
  return isDark.value ? "#272727" : "#f6f6f6";
});
const minimize = ref<HTMLElement>();
const maximize = ref<HTMLElement>();
const close = ref<HTMLElement>();
import { appWindow } from "@tauri-apps/api/window";
onMounted(() => {
  window.onresize = async () => {
    if (await appWindow.isMaximized()) {
      isFullScreen.value = true;
    } else {
      isFullScreen.value = false;
    }
  };
  minimize.value?.addEventListener("click", () => {
    appWindow.minimize();
  });
  maximize.value?.addEventListener("click", async () => {
    if (await appWindow.isMaximized()) {
      appWindow.unmaximize();
      isFullScreen.value = false;
    } else {
      isFullScreen.value = true;
      appWindow.maximize();
    }
  });
  close.value?.addEventListener("click", () => {
    appWindow.close();
  });
});
</script>
<style lang="scss">
.titlebar {
  height: 30px;
  background: v-bind(titleBarColor);
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  overflow: hidden;
  border-radius: 10px 10px 0 0;
  padding-left: 10px;
  padding-right: 5px;
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    .el-icon {
      font-size: 20px;
    }
  }
  .text {
    color: var(--el-text-color-primary);
    margin-left: 10px;
  }
  .btn {
    .titlebar-button {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
    }
    .titlebar-button:hover {
      background: var(--el-color-primary-light-7);
    }
  }
}
</style>
<style lang="scss" scoped></style>
