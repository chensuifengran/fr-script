<template>
  <div
    class="notification-content"
    :style="{
      borderRadius: isMiniState ? '35px' : undefined,
    }"
  >
    <template v-if="!isMiniState">
      <div class="title">
        <el-text size="small" data-tauri-drag-region style="cursor: move">{{
          scriptInfo.name
        }}</el-text>
        <div data-tauri-drag-region style="cursor: move" class="move"></div>
        <div class="btns">
          <el-tooltip effect="dark" content="精简显示" placement="bottom">
            <el-button class="btn" size="small" @click="minimize" circle
              ><el-icon><IEpArrowLeft /></el-icon
            ></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="返回主界面" placement="bottom">
            <el-button class="btn" size="small" @click="home" circle
              ><el-icon><IEpHouse /></el-icon
            ></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="结束运行" placement="bottom">
            <el-button class="btn" type="danger" size="small" @click="close" circle
              ><el-icon><IEpClose /></el-icon
            ></el-button>
          </el-tooltip>
        </div>
      </div>
      <el-scrollbar height="100px" class="msg-box">
        <div
          v-for="item in scriptInfo.currentMessage"
          :key="JSON.stringify(item)"
          class="msg-item"
          :style="{
            color: colorMap[item.type || 'info'],
          }"
        >
          [{{ item.time }}]: {{ item.message }}
        </div>
      </el-scrollbar>
    </template>
    <template v-else>
      <div class="mini-box" data-tauri-drag-region style="cursor: move">
        <div
          class="msg-item max"
          data-tauri-drag-region
          style="cursor: move"
          :style="{
            color: colorMap[firstItem.type || 'info'],
          }"
        >
          <span class="loader" v-if="firstItem.type === 'loading'"></span>
          <el-icon size="small" v-else-if="firstItem.type === 'success'"
            ><IEpSuccessFilled
          /></el-icon>
          <el-icon size="small" v-else-if="firstItem.type === 'warning'"
            ><IEpWarningFilled
          /></el-icon>
          <el-icon size="small" v-else-if="firstItem.type === 'info'"
            ><IEpInfoFilled
          /></el-icon>
          <el-icon size="small" v-else><IEpWarnTriangleFilled /></el-icon>
          {{ firstItem.message }}
        </div>
        <el-button class="button" @click="maximize" circle size="small">
          <el-icon><IEpArrowDown /></el-icon>
        </el-button>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { LogicalSize, WebviewWindow, appWindow } from "@tauri-apps/api/window";
const isMiniState = ref(false);
const notificationChannel = new BroadcastChannel("notification-channel");
const appBackground = inject<globalThis.ComputedRef<"#000" | "#fff">>("appBackground");
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
const firstItem = computed(() => scriptInfo.currentMessage[0]);
notificationChannel.onmessage = (e) => {
  const { type, payload } = e.data as {
    type: string;
    payload: any;
  };
  if (type === "message") {
    scriptInfo.currentMessage.unshift(payload);
  } else if (type === "init") {
    scriptInfo.name = payload.name;
    scriptInfo.currentMessage = [];
  } else if (type === "clear-message") {
    scriptInfo.currentMessage = [];
  } else if (type === "done") {
    scriptInfo.currentMessage = [];
    appWindow.hide();
  }
};

const close = () => {
  notificationChannel.postMessage({
    type: "end",
  });
  appWindow.close();
};
const home = () => {
  WebviewWindow.getByLabel("main")?.show();
  appWindow.hide();
};
const minimize = () => {
  isMiniState.value = true;
  appWindow.setSize(new LogicalSize(200, 35));
};
const maximize = () => {
  isMiniState.value = false;
  appWindow.setSize(new LogicalSize(200, 135));
};
onMounted(() => {
  minimize();
});
</script>

<style lang="scss" scoped>
.msg-item {
  padding: 5px 10px;
  background: v-bind(appBackground);
  margin-bottom: 1px;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  flex-direction: row;
  align-items: center;
  &:hover {
    background: v-bind(appAsideBgColor);
  }
}
.notification-content {
  width: 100%;
  height: 100%;
  position: relative;

  .msg-box {
    width: 100%;
    background-color: v-bind(appAsideBgColor);
  }
  .title {
    display: flex;
    align-items: center;
    padding: 0 0 0 10px;
    height: 30px;
    background-color: v-bind(appAsideBgColor);
    border-bottom: 1px solid v-bind(appBackground);
    .move {
      flex: 1;
      height: 35px;
    }
    .btns {
      width: 90px;
      .btn {
        margin: 0;
        margin-right: 5px;
        padding: 0;
      }
    }
  }
  .mini-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 5px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    .max {
      flex: 1;
      &:hover {
        background: v-bind(appBackground);
      }
    }
    .button {
      background: transparent;
      margin: 0;
      padding: 0;
    }
  }
}
.loader {
  color: v-bind(oppositeBgColor);
  font-size: 12px;
  text-indent: -9999em;
  overflow: hidden;
  display: inline-block;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  position: relative;
  transform: translateZ(0);
  margin-right: 5px;
  animation: mltShdSpin 1.7s infinite ease, round 1.7s infinite ease;
}

@keyframes mltShdSpin {
  0% {
    box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
      0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
  5%,
  95% {
    box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
      0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
  10%,
  59% {
    box-shadow: 0 -0.83em 0 -0.4em, -0.087em -0.825em 0 -0.42em,
      -0.173em -0.812em 0 -0.44em, -0.256em -0.789em 0 -0.46em,
      -0.297em -0.775em 0 -0.477em;
  }
  20% {
    box-shadow: 0 -0.83em 0 -0.4em, -0.338em -0.758em 0 -0.42em,
      -0.555em -0.617em 0 -0.44em, -0.671em -0.488em 0 -0.46em,
      -0.749em -0.34em 0 -0.477em;
  }
  38% {
    box-shadow: 0 -0.83em 0 -0.4em, -0.377em -0.74em 0 -0.42em,
      -0.645em -0.522em 0 -0.44em, -0.775em -0.297em 0 -0.46em, -0.82em -0.09em 0 -0.477em;
  }
  100% {
    box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
      0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
}

@keyframes round {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
