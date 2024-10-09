<template>
  <div
    class="notification-content"
    data-tauri-drag-region
    style="cursor: move"
    v-show="fullWindow"
  >
    <div
      class="content"
      data-tauri-drag-region
      style="cursor: move"
      :style="{
        color: colorMap[scriptInfo.currentMessage.type || 'info'],
      }"
    >
      <DotLoader
        class="icon"
        v-if="scriptInfo.currentMessage.type === 'loading'"
        data-tauri-drag-region
        style="cursor: move"
      />
      <el-icon
        class="icon"
        size="small"
        v-else-if="scriptInfo.currentMessage.type === 'success'"
        data-tauri-drag-region
        style="cursor: move"
      >
        <CheekIcon data-tauri-drag-region />
      </el-icon>
      <el-icon
        class="icon"
        size="small"
        v-else-if="scriptInfo.currentMessage.type === 'warning'"
        data-tauri-drag-region
        style="cursor: move"
      >
        <AlertOutline data-tauri-drag-region />
      </el-icon>
      <el-icon
        class="icon"
        size="small"
        v-else-if="scriptInfo.currentMessage.type === 'danger'"
        data-tauri-drag-region
        style="cursor: move"
      >
        <AlertCircle data-tauri-drag-region />
      </el-icon>
      <InfoIcon
        data-tauri-drag-region
        class="icon"
        size="small"
        v-else
        style="cursor: move"
      />
      <el-tag
        class="icon"
        size="small"
        type="primary"
        v-if="scriptInfo.currentMessage.type === 'loading'"
        data-tauri-drag-region
        style="cursor: move"
        >{{ useTime }}</el-tag
      >
      <el-text class="message" data-tauri-drag-region style="cursor: move">{{
        scriptInfo.currentMessage.message
      }}</el-text>
    </div>
    <div class="btns">
      <el-button class="btn" size="small" @click="home" circle
        ><el-icon> <span i-mdi-home-export-outline></span> </el-icon
      ></el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  LogicalSize,
  PhysicalPosition,
  PhysicalSize,
} from "@tauri-apps/api/dpi";
import { UnlistenFn } from "@tauri-apps/api/event";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { WebviewWindowUtil } from "../utils/windowUtil";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { getCurrentWebview } from "@tauri-apps/api/webview";
const appWindow = getCurrentWindow();
const appWebview = getCurrentWebview();
const { borderRadius, appOpacity, appTransform, oppositeBgColor } =
  useAppTheme();
const { open } = windowUtil;
let adsorptionPredictionWindow: WebviewWindowUtil | null;
const loadingTime = ref(1);
const useTime = computed(() => {
  const hours = Math.floor(loadingTime.value / 3600);
  const minutes = Math.floor((loadingTime.value % 3600) / 60);
  const seconds = Math.floor(loadingTime.value % 60);
  return `${hours ? `${hours}:` : ""}${minutes ? `${minutes}:` : ""}${seconds}`;
});
const { notify } = eventUtil;

const colorMap = reactive({
  info: oppositeBgColor?.value,
  loading: oppositeBgColor?.value,
  success: "#67c23a",
  warning: "#e6a23c",
  danger: "#f56c6c",
});
const scriptInfo = reactive<{
  name: string;
  currentMessage: {
    type?: "info" | "success" | "warning" | "danger" | "loading";
    message: string;
    time: string;
  };
}>({
  name: "运行中",
  currentMessage: {
    type: "info",
    message: "",
    time: "",
  },
});
let leaveWindow = false;
const home = async () => {
  (await WebviewWindow.getByLabel("main"))?.show();
  appWindow.hide();
  leaveWindow = true;
};
//吸附距离
const DISTENCE = 50;
//收缩后宽度或高度
const shrinkWidthOrHeight = 10;
let checkStateInterval: NodeJS.Timeout | undefined;
const stateCache = <
  { lastX: number; lastY: number; lastMirrorPos: "left" | "right" | "top" | "" }
>{
  lastX: 0,
  lastY: 0,
  lastMirrorPos: "",
};
let SCREEN_SIZE: { width: number; height: number } | null;
let absorbTimer: NodeJS.Timeout | undefined;
const fullWindow = ref(true);
watch(fullWindow, async () => {
  absorbTimer && clearTimeout(absorbTimer);
  if (fullWindow.value) {
    //恢复窗口
    appTransform.value = `none`;
    borderRadius.value = "20px";
    await appWindow?.setSize(new LogicalSize(300, 40));
    await appWebview?.setSize(new LogicalSize(300, 40));
    appOpacity.value = 1;
    await nextTick();
    if (stateCache.lastMirrorPos === "right") {
      if (SCREEN_SIZE) {
        const appPos = await adsorptionPredictionWindow
          ?.getWindow()
          .outerPosition();
        await appWindow?.setPosition(
          new PhysicalPosition(SCREEN_SIZE.width - 300, appPos?.y || 0)
        );
      }
    }
  } else {
    //吸附窗口
    if (stateCache.lastMirrorPos === "") {
      return;
    }
    const appPos = await appWindow.outerPosition();
    const appSize = await appWindow.innerSize();
    if (stateCache.lastMirrorPos === "left") {
      await appWindow?.setPosition(new PhysicalPosition(0, appPos.y));
      appTransform.value = `translateX(calc(-100% + ${shrinkWidthOrHeight}px))`;
      borderRadius.value = "0px 10px 10px 0px";
      absorbTimer = setTimeout(() => {
        appWindow?.setSize(
          new LogicalSize(shrinkWidthOrHeight, appSize.height)
        );
        appWebview?.setSize(
          new LogicalSize(shrinkWidthOrHeight, appSize.height)
        );
        appOpacity.value = 0.5;
        clearTimeout(absorbTimer);
      }, 1000);
    } else if (stateCache.lastMirrorPos === "right") {
      await appWindow?.setPosition(
        new PhysicalPosition(SCREEN_SIZE!.width - appSize.width, appPos.y)
      );
      appTransform.value = `translateX(calc(100% - ${shrinkWidthOrHeight}px))`;
      borderRadius.value = "10px 0px 0px 10px";
      absorbTimer = setTimeout(async () => {
        await appWindow?.setSize(
          new LogicalSize(shrinkWidthOrHeight, appSize.height)
        );
        await appWebview?.setSize(
          new LogicalSize(shrinkWidthOrHeight, appSize.height)
        );
        await appWindow.setPosition(
          new PhysicalPosition(
            SCREEN_SIZE!.width - shrinkWidthOrHeight,
            appPos.y
          )
        );
        appOpacity.value = 0.5;
        clearTimeout(absorbTimer);
      }, 1000);
    } else {
      await appWindow?.setPosition(new PhysicalPosition(appPos.x, 0));
      appTransform.value = `translateY(calc(-100% + ${shrinkWidthOrHeight}px))`;
      borderRadius.value = "0px 0px 10px 10px";
      absorbTimer = setTimeout(async () => {
        await appWindow?.setSize(
          new LogicalSize(appSize.width, shrinkWidthOrHeight)
        );
        await appWebview?.setSize(
          new LogicalSize(appSize.width, shrinkWidthOrHeight)
        );
        appOpacity.value = 0.5;
        clearTimeout(absorbTimer);
      }, 1000);
    }
    await adsorptionPredictionWindow?.hide();
  }
});
const getMirrorPos = async (
  windowSize?: PhysicalSize,
  windowPos?: PhysicalPosition
) => {
  const appSize = windowSize ?? (await appWindow.innerSize());
  const { x, y } = windowPos ?? (await appWindow.outerPosition());
  SCREEN_SIZE = SCREEN_SIZE ?? (await invokeBaseApi.getScreenSize());
  const { width } = SCREEN_SIZE;
  let pos: "left" | "right" | "top" | "" = "";
  if (y < DISTENCE) {
    if (x < DISTENCE) {
      if (y <= x) {
        pos = "top";
      } else {
        pos = "left";
      }
    } else if (width - appSize.width - x < DISTENCE) {
      if (y <= width - appSize.width - x) {
        pos = "top";
      } else {
        pos = "right";
      }
    } else {
      pos = "top";
    }
  } else {
    if (x < DISTENCE) {
      pos = "left";
    } else if (width - appSize.width - x < DISTENCE) {
      pos = "right";
    }
  }
  return pos;
};
const mouseInWindow = async (
  windowSize: PhysicalSize,
  windowPos: PhysicalPosition
) => {
  const { x, y } = await invokeBaseApi.getMousePos();
  if (
    x >= windowPos.x &&
    x <= windowPos.x + windowSize.width &&
    y >= windowPos.y &&
    y <= windowPos.y + windowSize.height
  ) {
    return true;
  } else {
    return false;
  }
};
const updateMirrorWindow = async (
  mirrorPos: "left" | "right" | "top" | "",
  winSize: PhysicalSize,
  winPos: PhysicalPosition
) => {
  if (!fullWindow.value) {
    adsorptionPredictionWindow?.hide();
    return;
  }
  if (mirrorPos === "") {
    adsorptionPredictionWindow?.hide();
    return;
  }
  if (mirrorPos === "top") {
    await notify.sendCustom({
      name: "borderRadius",
      message: "0 0 10px 10px",
    });
    await adsorptionPredictionWindow?.setSize(
      new LogicalSize(winSize.width, shrinkWidthOrHeight)
    );
    await adsorptionPredictionWindow?.setPos(new PhysicalPosition(winPos.x, 0));
  } else if (mirrorPos === "left") {
    await notify.sendCustom({
      name: "borderRadius",
      message: "0px 10px 10px 0px",
    });
    await adsorptionPredictionWindow?.setSize(
      new LogicalSize(shrinkWidthOrHeight, winSize.height)
    );
    await adsorptionPredictionWindow?.setPos(new PhysicalPosition(0, winPos.y));
  } else if (mirrorPos === "right") {
    await notify.sendCustom({
      name: "borderRadius",
      message: "10px 0px 0px 10px",
    });
    await adsorptionPredictionWindow?.setSize(
      new LogicalSize(shrinkWidthOrHeight, winSize.height)
    );
    if (!SCREEN_SIZE) {
      SCREEN_SIZE = await invokeBaseApi.getScreenSize();
    }
    await adsorptionPredictionWindow?.setPos(
      new PhysicalPosition(SCREEN_SIZE.width - shrinkWidthOrHeight, winPos.y)
    );
  }
  await adsorptionPredictionWindow?.show();
};
let unlistenNotify: UnlistenFn;
let currentInterval: NodeJS.Timeout;

onMounted(async () => {
  SCREEN_SIZE = await invokeBaseApi.getScreenSize();
  unlistenNotify = await notify.listen((data) => {
    const { type, payload } = data.payload as {
      type: string;
      payload: any;
    };
    if (type === "message") {
      currentInterval && clearInterval(currentInterval);
      scriptInfo.currentMessage = payload;
      if (payload.type === "loading") {
        loadingTime.value = 1;
        currentInterval = setInterval(() => {
          loadingTime.value += 1;
        }, 1000);
      }
    } else if (type === "init") {
      scriptInfo.name = payload.name;
      leaveWindow = false;
      scriptInfo.currentMessage = {
        type: "info",
        message: "",
        time: "",
      };
    } else if (type === "clear-message") {
      scriptInfo.currentMessage = {
        type: "info",
        message: "",
        time: "",
      };
    } else if (type === "done") {
      scriptInfo.currentMessage = {
        type: "info",
        message: "",
        time: "",
      };
      appWindow.hide();
      leaveWindow = true;
    } else if (type === "custom-message") {
      const { name } = payload;
      if (name === "continue") {
        leaveWindow = false;
      }
    }
  });
  adsorptionPredictionWindow = await open("floatWindow", "/floatWindow", {
    height: 300,
    width: 40,
    alwaysOnTop: false,
  });
  await notify.sendCustom({
    name: "opacity",
    message: "0.5",
  });
  nextTick(async () => {
    (await WebviewWindow.getByLabel("floatWindow"))?.hide();
  });
  const timer = setTimeout(async () => {
    (await WebviewWindow.getByLabel("floatWindow"))?.hide();
    clearTimeout(timer);
  }, 500);
  appWindow.setSize(new LogicalSize(300, 40));
  appWebview.setSize(new LogicalSize(300, 40));
  borderRadius.value = "20px";
  checkStateInterval = setInterval(async () => {
    if (leaveWindow || !(await appWindow.isVisible())) {
      return;
    }
    const mousePos = await invokeBaseApi.getMousePos();
    if (mousePos.x === stateCache.lastX && mousePos.y === stateCache.lastY) {
      return;
    } else {
      stateCache.lastX = mousePos.x;
      stateCache.lastY = mousePos.y;
    }
    const winSize = await appWindow.innerSize();
    const winPos = await appWindow.outerPosition();
    const mirrorPos = await getMirrorPos(winSize, winPos);
    stateCache.lastMirrorPos = mirrorPos;
    if (mirrorPos === "") {
      fullWindow.value = true;
    } else {
      const mouseLeaveWindow = !(await mouseInWindow(winSize, winPos));
      if (mouseLeaveWindow) {
        fullWindow.value = false;
      } else {
        fullWindow.value = true;
      }
    }
    await updateMirrorWindow(mirrorPos, winSize, winPos);
  }, 200);
});
onBeforeUnmount(async () => {
  currentInterval && clearInterval(currentInterval);
  checkStateInterval && clearInterval(checkStateInterval);
  unlistenNotify();
  (await WebviewWindow.getByLabel("floatWindow"))?.hide();
});
</script>
<style lang="scss" scoped>
.notification-content {
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
    display: none;
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

  &:hover {
    .btns {
      display: flex;
    }
  }
}

.icon {
  margin-right: 3px;
  margin-left: 3px;
  font-size: 12px;
}
</style>
