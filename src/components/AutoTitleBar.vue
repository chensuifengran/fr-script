<template>
  <div data-tauri-drag-region class="titlebar">
    <div class="title" data-tauri-drag-region>
      <div class="text">
        <el-image style="width: 20px; height: 20px" :src="icon" /><span>{{
          info.title
        }}</span>
      </div>
      <div
        class="api-test-bar"
        data-tauri-drag-region
        v-if="info.showContentType === 'apiTest'"
      >
        <el-input
          class="search-ipt"
          v-model="info.apiTest.searchValue"
          clearable
          placeholder="可输入API的关键字对API进行筛选"
        >
        </el-input>
        <el-button class="output-btn" @click="info.apiTest.openOutput = true"
          ><el-icon><IEpNotification /></el-icon
        ></el-button>
      </div>
    </div>
    <div class="btn">
      <el-tooltip
        effect="light"
        content="基础功能不可用，点我安装依赖"
        placement="bottom"
        v-if="appGSStore.app.dependenceState === '不可用'"
      >
        <div class="titlebar-button warning-btn" @click="goInstallDeps()">
          <el-icon><IEpWarning /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="light"
        content="有新版本，点我更新"
        placement="bottom"
        v-if="showSetupBtn"
      >
        <div class="titlebar-button setup-btn">
          <el-icon><IEpDownload /></el-icon>
        </div>
      </el-tooltip>

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
import { appWindow } from "@tauri-apps/api/window";
import icon from "../assets/icon64x64.png";
import { getVersion } from "@tauri-apps/api/app";
const { info } = useAutoTitleBar();
const { goInstallDeps } = useDepInfo();
const isDark = inject<globalThis.WritableComputedRef<boolean>>("isDark")!;
const isFullScreen = ref(false);
const titleBarColor = computed(() => {
  return isDark.value ? "#272727" : "#f6f6f6";
});
const minimize = ref<HTMLElement>();
const maximize = ref<HTMLElement>();
const close = ref<HTMLElement>();
const version = ref("获取版本失败");
getVersion().then((res) => {
  version.value = res;
});
const appGSStore = useAppGlobalSettings();
const showSetupBtn = computed(() => {
  return (
    version.value !== "获取版本失败" && version.value !== appGSStore.app.latestVersion
  );
});
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
<style lang="scss" scoped>
.titlebar {
  height: 40px;
  background: v-bind(titleBarColor);
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  overflow: hidden;
  border-radius: 10px 10px 0 0;
  padding-left: 10px;
  padding-right: 5px;
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;
  }
  .text {
    color: var(--el-text-color-primary);
    // margin-left: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .api-test-bar {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .search-ipt {
      width: 500px;
    }
    .output-btn {
      margin-left: 5px;
    }
  }
  .btn {
    .titlebar-button {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      cursor: pointer;
      &.setup-btn {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background-color: rgb(24, 190, 93);
        color: #fff;
        margin-right: 5px;
        &:hover {
          background-color: rgb(3, 211, 89);
        }
      }
      &.warning-btn {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background-color: rgb(255, 45, 34);
        color: #fff;
        margin-right: 5px;
        &:hover {
          background-color: rgb(255, 87, 34);
        }
      }
    }
    .titlebar-button:hover {
      background: var(--el-color-primary-light-7);
    }
  }
}
</style>
