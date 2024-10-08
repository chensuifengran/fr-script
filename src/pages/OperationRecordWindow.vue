<template>
  <div class="OR-content" data-tauri-drag-region style="cursor: move">
    <div
      class="content"
      data-tauri-drag-region
      style="cursor: move"
      :style="{
        color: oppositeBgColor,
      }"
    >
      <el-icon class="icon" data-tauri-drag-region style="cursor: move">
        <span i-svg-spinners-pulse-rings-multiple></span>
      </el-icon>
      <el-tag
        class="icon"
        size="small"
        type="primary"
        data-tauri-drag-region
        style="cursor: move"
        >{{ useTime }}</el-tag
      >
      <el-text class="message" data-tauri-drag-region style="cursor: move"
        >操作录制中</el-text
      >
    </div>
    <div class="btns">
      <el-button
        class="btn"
        size="small"
        type="danger"
        @click="stopRecording"
        circle
        ><el-icon> <span i-mdi-stop-circle-outline></span> </el-icon
      ></el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { LogicalSize } from "@tauri-apps/api/dpi";
import { UnlistenFn } from "@tauri-apps/api/event";
import {
  WebviewWindow,
  getCurrentWebviewWindow,
} from "@tauri-apps/api/webviewWindow";
const appWindow = getCurrentWebviewWindow();
const { borderRadius, appOpacity, oppositeBgColor } = useAppTheme();

const loadingTime = ref(1);
const useTime = computed(() => {
  const hours = Math.floor(loadingTime.value / 3600);
  const minutes = Math.floor((loadingTime.value % 3600) / 60);
  const seconds = Math.floor(loadingTime.value % 60);
  return `${hours ? `${hours}:` : ""}${minutes ? `${minutes}:` : ""}${seconds}`;
});

let currentInterval: NodeJS.Timeout;
let unlistenNotify: UnlistenFn;
const init = () => {
  appWindow.setSize(new LogicalSize(180, 40));
  borderRadius.value = "20px";
  appWindow.show();
  loadingTime.value = 1;
  currentInterval = setInterval(() => {
    loadingTime.value += 1;
  }, 1000);
};
onMounted(async () => {
  appWindow.hide();
  unlistenNotify = await eventUtil.notify.listen<{
    type: string;
    payload: any;
  }>((data) => {
    const { type, payload } = data.payload;
    if (type === "custom-message") {
      const { name } = payload;
      if (name === "init") {
        init();
      } else if (name === "stop") {
        currentInterval && clearInterval(currentInterval);
      }
    }
  });
});
onBeforeUnmount(() => {
  currentInterval && clearInterval(currentInterval);
  unlistenNotify && unlistenNotify();
});
const stopRecording = async () => {
  await invokeBaseApi.stopCaptureOperation();
  (await WebviewWindow.getByLabel("main"))?.show();
  currentInterval && clearInterval(currentInterval);
  appWindow.hide();
};
</script>
<style lang="scss" scoped>
.OR-content {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  position: relative;
  padding-left: 10px;
  padding-right: 10px;
  box-sizing: border-box;
  opacity: v-bind(appOpacity);

  .content {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 30px;
  }

  .message {
    margin-left: 3px;
    font-size: 12px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .btns {
    display: flex;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 30px;
    flex-direction: row;
    align-items: center;

    .btn {
      margin: 0;
      margin-right: 5px;
      padding: 0;
    }
  }
}

.icon {
  margin-right: 3px;
  margin-left: 3px;
  font-size: 12px;
}
</style>
