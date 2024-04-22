<template>
  <div class="notification-content" data-tauri-drag-region style="cursor: move" v-show="fullWindow">
    <div class="content" data-tauri-drag-region style="cursor: move" :style="{
      color: colorMap[firstItem.type || 'info'],
    }">
      <DotLoader class="icon" v-if="firstItem.type === 'loading'" data-tauri-drag-region style="cursor: move" />
      <el-icon class="icon" size="small" v-else-if="firstItem.type === 'success'" data-tauri-drag-region
        style="cursor: move">
        <IEpSuccessFilled data-tauri-drag-region />
      </el-icon>
      <el-icon class="icon" size="small" v-else-if="firstItem.type === 'warning'" data-tauri-drag-region
        style="cursor: move">
        <IEpWarningFilled data-tauri-drag-region />
      </el-icon>
      <el-icon class="icon" size="small" v-else-if="firstItem.type === 'info'" data-tauri-drag-region
        style="cursor: move">
        <IEpInfoFilled data-tauri-drag-region />
      </el-icon>
      <el-icon class="icon" size="small" v-else-if="firstItem.type === 'danger'" data-tauri-drag-region
        style="cursor: move">
        <IEpWarnTriangleFilled data-tauri-drag-region />
      </el-icon>
      <el-tag class="icon" size="small" type="primary" v-if="firstItem.type === 'loading'" data-tauri-drag-region
        style="cursor: move">{{ useTime }}</el-tag>
      <el-text class="message" data-tauri-drag-region style="cursor: move">{{
        firstItem.message
      }}</el-text>
    </div>
    <div class="btns">
      <el-button class="btn" size="small" @click="home" circle><el-icon>
          <IEpHouse />
        </el-icon></el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { UnlistenFn } from "@tauri-apps/api/event";
import {
  LogicalSize,
  PhysicalPosition,
  PhysicalSize,
  WebviewWindow,
  appWindow,
} from "@tauri-apps/api/window";
const { borderRadius, appOpacity, appTransform } = useAppTheme();
const { createWindow } = useWebviewWindow();
let adsorptionPredictionWindow: WebviewWindow | undefined;
const loadingTime = ref(1);
const appAsideBgColor = inject<globalThis.ComputedRef<"#272727" | "#f6f6f6">>(
  "appAsideBgColor"
);
const oppositeBgColor = computed(() => {
  if (appAsideBgColor?.value) {
    return appAsideBgColor.value === "#272727" ? "#f6f6f6" : "#272727";
  } else {
    return "#f6f6f6";
  }
});
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
  }[];
}>({
  name: "运行中",
  currentMessage: [
    {
      type: "info",
      message: "",
      time: "",
    },
  ],
});
let leaveWindow = false;
const firstItem = computed(() => scriptInfo.currentMessage[0] || {});
const home = () => {
  WebviewWindow.getByLabel("main")?.show();
  appWindow.hide();
  leaveWindow = true;
};


//吸附距离
const DISTENCE = 50;
//收缩后宽度或高度
const shrinkWidthOrHeight = 10;
let checkStateInterval: NodeJS.Timeout | undefined;
const stateCache = <{ lastX: number, lastY: number, lastMirrorPos: 'left' | 'right' | 'top' | '' }>{
  lastX: 0,
  lastY: 0,
  lastMirrorPos: ''
}
let SCREEN_SIZE: { width: number, height: number } | null;
let absorbTimer: NodeJS.Timeout | undefined;
const fullWindow = ref(true);
watch(fullWindow, async () => {
  absorbTimer && clearTimeout(absorbTimer);
  const mirrorWindow = adsorptionPredictionWindow || WebviewWindow.getByLabel("floatWindow");
  if (fullWindow.value) {
    //恢复窗口
    appTransform.value = `none`;
    borderRadius.value = '20px';
    await appWindow?.setSize(new LogicalSize(300, 40));
    appOpacity.value = 1;
    await nextTick();
    if (stateCache.lastMirrorPos === 'right') {
      if (SCREEN_SIZE) {
        const appPos = await mirrorWindow?.outerPosition();
        await appWindow?.setPosition(new PhysicalPosition(SCREEN_SIZE.width - 300, appPos?.y || 0));
      }
    }
  } else {
    //吸附窗口
    if (stateCache.lastMirrorPos === '') {
      return;
    }
    const appPos = await appWindow.outerPosition();
    const appSize = await appWindow.innerSize();
    if (stateCache.lastMirrorPos === 'left') {
      await appWindow?.setPosition(new PhysicalPosition(0, appPos.y));
      appTransform.value = `translateX(calc(-100% + ${shrinkWidthOrHeight}px))`
      borderRadius.value = '0px 10px 10px 0px';
      absorbTimer = setTimeout(() => {
        appWindow?.setSize(new LogicalSize(shrinkWidthOrHeight, appSize.height));
        appOpacity.value = 0.5;
        clearTimeout(absorbTimer);
      }, 1000);
    } else if (stateCache.lastMirrorPos === 'right') {
      await appWindow?.setPosition(new PhysicalPosition(SCREEN_SIZE!.width - appSize.width, appPos.y));
      appTransform.value = `translateX(calc(100% - ${shrinkWidthOrHeight}px))`
      borderRadius.value = '10px 0px 0px 10px';
      absorbTimer = setTimeout(async () => {
        await appWindow?.setSize(new LogicalSize(shrinkWidthOrHeight, appSize.height));
        await appWindow.setPosition(new PhysicalPosition(SCREEN_SIZE!.width - shrinkWidthOrHeight, appPos.y));
        appOpacity.value = 0.5;
        clearTimeout(absorbTimer);
      }, 1000);
    } else {
      await appWindow?.setPosition(new PhysicalPosition(appPos.x, 0));
      appTransform.value = `translateY(calc(-100% + ${shrinkWidthOrHeight}px))`
      borderRadius.value = '0px 0px 10px 10px';
      absorbTimer = setTimeout(async () => {
        await appWindow?.setSize(new LogicalSize(appSize.width, shrinkWidthOrHeight));
        appOpacity.value = 0.5;
        clearTimeout(absorbTimer);
      }, 1000);
    }
    await mirrorWindow?.hide();
  }
});
const getMirrorPos = async (windowSize?: PhysicalSize, windowPos?: PhysicalPosition) => {
  const appSize = windowSize || (await appWindow.innerSize());
  const { x, y } = windowPos || (await appWindow.outerPosition());
  const { width } = await invokeBaseApi.getScreenSize();
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
}


const mouseInWindow = async (windowSize: PhysicalSize, windowPos: PhysicalPosition) => {
  const { x, y } = await invokeBaseApi.getMousePos();
  if (x >= windowPos.x && x <= windowPos.x + windowSize.width && y >= windowPos.y && y <= windowPos.y + windowSize.height) {
    return true;
  } else {
    return false;
  }
}
const updateMirrorWindow = async (mirrorPos: 'left' | 'right' | 'top' | '', winSize: PhysicalSize, winPos: PhysicalPosition) => {
  const mirrorWindow = adsorptionPredictionWindow || WebviewWindow.getByLabel('floatWindow');
  if (!fullWindow.value) {
    mirrorWindow?.hide();
    return;
  }
  if (mirrorPos === '') {
    mirrorWindow?.hide();
    return;
  }
  if (mirrorPos === 'top') {
    await notify.sendCustom({
      name: "borderRadius",
      message: "0 0 10px 10px",
    });

    await mirrorWindow?.setSize(new LogicalSize(winSize.width, shrinkWidthOrHeight));
    await mirrorWindow?.setPosition(new PhysicalPosition(winPos.x, 0));
  } else if (mirrorPos === 'left') {
    await notify.sendCustom({
      name: "borderRadius",
      message: "0px 10px 10px 0px",
    });
    await mirrorWindow?.setSize(new LogicalSize(shrinkWidthOrHeight, winSize.height));
    await mirrorWindow?.setPosition(new PhysicalPosition(0, winPos.y));
  } else if (mirrorPos === 'right') {
    await notify.sendCustom({
      name: "borderRadius",
      message: "10px 0px 0px 10px",
    });
    await mirrorWindow?.setSize(new LogicalSize(shrinkWidthOrHeight, winSize.height));
    if (!SCREEN_SIZE) {
      SCREEN_SIZE = await invokeBaseApi.getScreenSize();
    }
    await mirrorWindow?.setPosition(new PhysicalPosition(SCREEN_SIZE.width - shrinkWidthOrHeight, winPos.y));
  }
  await mirrorWindow?.show();
}
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
      scriptInfo.currentMessage.unshift(payload);
      if (payload.type === "loading") {
        loadingTime.value = 1;
        currentInterval = setInterval(() => {
          loadingTime.value += 1;
        }, 1000);
      }
    } else if (type === "init") {
      scriptInfo.name = payload.name;
      leaveWindow = false;
      scriptInfo.currentMessage = [];
    } else if (type === "clear-message") {
      scriptInfo.currentMessage = [];
    } else if (type === "done") {
      scriptInfo.currentMessage = [];
      appWindow.hide();
      leaveWindow = true;
    } else if (type === 'custom-message') {
      const { name } = payload;
      if (name === 'continue') {
        leaveWindow = false;
      }
    }
  });
  adsorptionPredictionWindow = createWindow("floatWindow", "/floatWindow", {
    height: 300,
    width: 40,
    alwaysOnTop: false,
  });
  await notify.sendCustom({
    name: "opacity",
    message: "0.5",
  });
  nextTick(() => {
    WebviewWindow.getByLabel("floatWindow")?.hide();
  });
  const timer = setTimeout(() => {
    WebviewWindow.getByLabel("floatWindow")?.hide();
    clearTimeout(timer);
  }, 500);
  appWindow.setSize(new LogicalSize(300, 40));
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
    if (mirrorPos === '') {
      fullWindow.value = true;
    } else {
      const mouseLeaveWindow = !await mouseInWindow(winSize, winPos);
      if (mouseLeaveWindow) {
        fullWindow.value = false;
      } else {
        fullWindow.value = true;
      }
    }
    await updateMirrorWindow(mirrorPos, winSize, winPos);
  }, 200);
});
onBeforeUnmount(() => {
  currentInterval && clearInterval(currentInterval);
  checkStateInterval && clearInterval(checkStateInterval);
  unlistenNotify();
  WebviewWindow.getByLabel("floatWindow")?.hide();
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
    margin-left: 5px;
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
  margin-right: 10px;
  margin-left: 10px;
  font-size: 12px;
}
</style>
