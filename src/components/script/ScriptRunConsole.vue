<template>
  <div class="run-code-box">
    <el-page-header @back="goBack" v-show="running !== 2" title="脚本列表">
      <template #content>
        <div class="head-content">
          <span class="s-name"
            >{{ name || "未保存的临时脚本" }} : {{ version || "未知版本" }}</span
          >
          <el-tooltip effect="dark" content="编辑脚本" placement="bottom">
            <el-icon class="icon" @click.stop="goEditor"><IEpEdit /></el-icon>
          </el-tooltip>
          <el-tooltip effect="dark" content="脚本设置" placement="bottom">
            <el-icon class="icon" @click.stop="goSetScript"><IEpSetting /></el-icon>
          </el-tooltip>
          <el-checkbox class="mgl-10" v-model="hideWindow" label="运行时隐藏窗口" />
        </div>
      </template>
      <template #extra>
        <div>
          <el-button @click="invokeStartHandle" v-show="running === 0"
            >开始<el-tag class="mgl-5" type="info" size="small"
              >Shift+Alt+S</el-tag
            ></el-button
          >
          <el-button @click="() => initScript(true)" v-show="running === 1"
            >重新初始化<el-tag class="mgl-5" type="info" size="small"
              >Shift+Alt+R</el-tag
            ></el-button
          >
        </div>
      </template>
    </el-page-header>
    <div v-show="running === 2" class="end-box">
      <div>
        <span class="s-name"
          >{{ name || "未保存的临时脚本" }} : {{ version || "未知版本" }}</span
        >
        <el-tag class="mgl-5" size="small" type="info" v-show="savePath">{{
          savePath
        }}</el-tag>
        <el-tag class="mgl-5" size="small" type="success">运行中</el-tag>
      </div>
      <el-button @click="stop" v-show="running === 2" type="danger"
        >结束<el-tag class="mgl-5" type="info" size="small"
          >Shift+Alt+D</el-tag
        ></el-button
      >
    </div>
    <div class="console-log-div" v-show="!isLoading">
      <renderer-form v-show="running === 0" :reInit="reInit" />
      <div class="log-box">
        <el-alert title="历史输出：" type="info" />
        <div id="consoleLogDiv">
          <el-alert
            class="alert-item"
            v-for="(log, idx) in logOutput"
            :key="idx"
            :title="`[${log.time}]: ${log.log}`"
            :type="
              log.type === 'danger' ? 'error' : log.type === 'loading' ? 'info' : log.type
            "
            :closable="false"
          />
        </div>
      </div>
    </div>
  </div>
  <teleport to="body">
    <div class="loading-box" v-if="isLoading">
      <loading />
      <div>脚本初始化中...</div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { register, unregister } from "@tauri-apps/api/globalShortcut";
import { WebviewWindow } from "@tauri-apps/api/window";
import { nanoid } from "nanoid";
import { storeToRefs } from "pinia";
import { transpile, ScriptTarget } from "typescript";
import { devicesFn } from "../../invokes/devices/exportFn";
import { disConnectToFn } from "../../invokes/disConnectTo/exportFn";
import { connectToFn } from "../../invokes/connectTo/exportFn";
import { cmdFn } from "../../invokes/cmd/exportFn";
const notificationChannel = new BroadcastChannel("notification-channel");

const hideWindow = ref(true);
const { notAllowedFnId, runningFnId } = useScriptRuntime();
const isReInit = ref(false);
let endBeforeCompletion = false;
const reInit = () => {
  if (isReInit.value) {
    isReInit.value = false;
    return true;
  } else {
    return false;
  }
};

const listStore = useListStore();
const { scriptList } = storeToRefs(listStore);
const appGSStore = useAppGlobalSettings();
const { openId, tempEditorValue, contentTransform, asideBarPos } = useScriptInfo();
const goSetScript = () => {
  router.replace("/script/setting");
};
const {
  replaceRendererList,
  pushElementToCheckList,
  pushElementToSelectList,
  pushElementToMGSList,
  pushElementToGSList,
  pushElementToTableList,
  buildForm,
  setAllTask,
  setCurTask,
  nextTask,
  setTaskEndStatus,
  getAllTask,
  getCurTask,
  getCurTaskName,
  buildTableForm,
  allRunTimeApi,
  getFnProxyStrings,
} = useScriptApi()!;

const running = ref(0);
const logOutput = reactive<
  {
    time: string;
    log: string;
    type: "success" | "danger" | "info" | "warning" | "loading";
  }[]
>([]);
const clearLogOutput = () => {
  logOutput.splice(0, logOutput.length);
  notificationChannel.postMessage({
    type: "clear-message",
  });
};

const pushLog = async (
  log: string,
  type?: "success" | "danger" | "info" | "warning" | "loading"
) => {
  const date = new Date(Date.now());
  //获取时分秒，时分秒不足两位补0
  const timeStr = [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((i) => {
      return i < 10 ? "0" + i : i;
    })
    .join(":");
  logOutput.push({
    time: timeStr,
    log,
    type: type ? type : "info",
  });
  notificationChannel.postMessage({
    type: "message",
    payload: {
      type,
      message: log,
      time: timeStr,
    },
  });
  const consoleLogDiv = document.getElementById("consoleLogDiv");
  consoleLogDiv && (consoleLogDiv.scrollTop = consoleLogDiv?.scrollHeight + 9999);
};

const getFileInfo = (type: "id" | "savePath" | "name" | "version" | "description") => {
  const target = scriptList.value.find((s) => s.id === openId!.value)!;

  switch (type) {
    case "id":
      return target?.id;
    case "name":
      return target?.name;
    case "description":
      return target?.description;
    case "savePath":
      return target?.savePath;
    case "version":
      return target?.version;

    default:
      console.error(type);
      return type;
  }
};
const getScriptId = () => getFileInfo("id");

const name = computed(() => {
  return getFileInfo("name");
});
const version = computed(() => {
  return getFileInfo("version");
});
const savePath = computed(() => {
  return getFileInfo("savePath");
});
const goBack = () => {
  router.replace({
    path: "/script/list",
  });
  asideBarPos.value = "relative";
  contentTransform.value = "translateX(0)";
  const targetWindow = WebviewWindow.getByLabel("apiTest");
  if (targetWindow) {
    targetWindow.hide();
  }
};
const goEditor = () => {
  contentTransform.value = "translateX(-100%)";
  asideBarPos.value = "absolute";
  //路由跳转到编辑器
  router.replace("/script/editor");
};
const notDelApi = ["changeScriptRunState", "isStop", "removeIntervals"];
const changeScriptRunState = (state: boolean | "stop", taskId?: string) => {
  if (taskId && taskId !== runningFnId.value) {
    return;
  }
  if (state === "stop") {
    running.value = 1;
    //移除window.runTimeApi所有属性
    console.log("脚本已强制结束,移除window.runTimeApi所有属性");
    //@ts-ignore
    window["runTimeApi"].removeIntervals && window["runTimeApi"].removeIntervals();
    if ((window as any)["runTimeApi"]) {
      Object.keys((window as any).runTimeApi).forEach((key) => {
        if (notDelApi.includes(key)) {
          return;
        }
        delete (window as any).runTimeApi[key];
      });
    }
    if (hideWindow.value) {
      WebviewWindow.getByLabel("main")?.show();
      notificationChannel.postMessage({
        type: "done",
      });
    }
  } else if (state) {
    clearLogOutput();
    pushLog("脚本就绪，等待开始运行", "info");
    running.value = 0;
    endBeforeCompletion = false;
  } else {
    if (endBeforeCompletion) {
      return;
    }
    running.value = 1;
    pushLog("脚本执行完成", "success");
    setTaskEndStatus("success", "脚本执行完成");
    console.log("脚本执行完成,移除window.runTimeApi所有属性");
    //移除window.runTimeApi所有属性
    console.log("脚本已强制结束,移除window.runTimeApi所有属性");
    if ((window as any)["runTimeApi"]) {
      Object.keys((window as any).runTimeApi).forEach((key) => {
        if (notDelApi.includes(key)) {
          return;
        }
        delete (window as any).runTimeApi[key];
      });
    }
    //显示当前窗口
    if (hideWindow.value) {
      WebviewWindow.getByLabel("main")?.show();
      notificationChannel.postMessage({
        type: "done",
      });
    }
  }
};

const getCustomizeForm = () => {
  return new Promise<RendererList[]>((resolve) => {
    const signal =
      (window as any).runTimeApi.startScriptSignal &&
      (window as any).runTimeApi.startScriptSignal.signal;
    const signalHandle = () => {
      (window as any).runTimeApi.abortSignalInScript = undefined;
      signal!.removeEventListener("abort", signalHandle);
      //保存此次运行选择的配置选项
      localStorage.setItem(
        (window as any).runTimeApi.getScriptId!() + "-rendererList",
        JSON.stringify((window as any).rendererList)
      );
      resolve((window as any).rendererList);
    };
    signal!.addEventListener("abort", signalHandle);
  });
};

const setIntervals: NodeJS.Timeout[] = [];
const run = (script: string, runId: string) => {
  script = script.replace(/\/\*[^\/]*\*\/|\/\/.+\n?/g, "");
  runningFnId.value = runId;
  //@ts-ignore
  window["runTimeApi"] = {
    ...allRunTimeApi,
    // devicesMapping: appStore.getDevicesMapping,
    buildForm,
    // RectUtil,
    setAllTask,
    setCurTask,
    nextTask,
    setInterval: (callback: () => void, ms?: number | undefined) => {
      const timeout = setInterval(callback, ms);
      setIntervals.push(timeout);
      return timeout;
    },
    clearInterval: (timeout: NodeJS.Timeout) => {
      clearInterval(timeout);
      setIntervals.splice(setIntervals.indexOf(timeout), 1);
    },
    removeIntervals: () => {
      setIntervals.forEach((i) => {
        clearInterval(i);
      });
      setIntervals.splice(0, setIntervals.length);
      console.log("已清除所有定时器");
    },
    getAllTask,
    getCurTask,
    getCurTaskName,
    abortSignalInScript: stopAbort.value,
    getScriptId,
    startScriptSignal: new AbortController(),
    getCustomizeForm,
    changeScriptRunState,
    // filePathIsExits,
    buildTableForm,
    ElNotification,
    clearLogOutput,
    pushLogProxy: pushLog,
    WORK_DIR: appGSStore.envSetting.workDir,
    SCREEN_SHOT_PATH: appGSStore.envSetting.screenshotSavePath,
    SCREEN_SHOT_DIR: pathUtils.resolve(
      appGSStore.envSetting.screenshotSavePath || "",
      "../"
    ),
    pushElementToSelectList,
    pushElementToCheckList,
    pushElementToMGSList,
    pushElementToGSList,
    pushElementToTableList,
    replaceRendererList,
    __httpValue: "http://",
    SCRIPT_ROOT_DIR: pathUtils.resolve(getFileInfo("savePath") || "", "../"),
    isStop: false,
    SCRIPT_ID: getScriptId(),
  };
  const runScript = `
  with(window.runTimeApi){

    const pushLog = (i,t) => {
      if(isStop) throw new Error("任务已结束");
      window.runTimeApi.pushLogProxy(i,t);
    };
    ${getFnProxyStrings(runId)}

    changeScriptRunState(true);
    replaceRendererList([]);
    pushElementToCheckList({
      targetGroupLabel: "*脚本设置",
      label: "导入上次运行配置",
      checked: false
    });
    const signal = abortSignalInScript && abortSignalInScript.signal;
    const signalHandle = ()=>{
      const error = new DOMException('任务被手动终止');
      try{changeScriptRunState && changeScriptRunState('stop');}catch(e){console.error(e);}
      abortSignalInScript = undefined;
      signal.removeEventListener('abort',signalHandle);
      isStop = true;
    }
    signal.addEventListener('abort',signalHandle);
    const evalFunction = async()=>{
      ${script}
      main && await main();
      removeIntervals();
      try{changeScriptRunState && changeScriptRunState(false, '${runId}');}catch(e){console.error(e);}
    }
    evalFunction();
  }

  `;
  //参数列表为空
  return new Function("", runScript);
};
const { createWindow } = useWebviewWindow();
const stopAbort = ref();
const invokeStartHandle = async () => {
  endBeforeCompletion = false;
  if (hideWindow.value) {
    WebviewWindow.getByLabel("main")?.hide();
    const targetWindow = createWindow("notification", "/notification", {
      height: 135,
      width: 200,
      alwaysOnTop: true,
    });
    targetWindow?.show();
    notificationChannel.postMessage({
      type: "init",
      payload: {
        name: name.value,
      },
    });
  }
  running.value = 2;
  (window as any).runTimeApi.startScriptSignal?.abort();
  const target = scriptList.value.find((s) => s.id === openId!.value);
  if (!target) return;
  const targetDevice = target.setting.targetAdbDevice.trim();
  if (targetDevice !== "") {
    //获得所有设备，取消非目标设备的连接
    const deviceList = (await devicesFn()) || [];
    const excludeDevices = [...new Set([...deviceList, ...target.setting.excludeDevice])];

    for (let i = 0; i < excludeDevices?.length; i++) {
      console.log("与设备断开连接：", excludeDevices[i]);
      await disConnectToFn(excludeDevices[i]);
    }
    //连接目标设备
    console.log("连接至设备：", targetDevice);
    await connectToFn(targetDevice);
  }
};
const stop = () => {
  isInit.value = false;
  endBeforeCompletion = true;
  notAllowedFnId.value.push(runningFnId.value);
  changeScriptRunState("stop");
  pushLog("脚本已强制结束", "warning");
  setTaskEndStatus("warning", "脚本已强制结束");
  stopAbort.value && stopAbort.value.abort();

  console.log("脚本已停止，随着出现的报错为正常情况，不影响使用");
};
const isInit = ref(false);
const initScript = async (reinit: boolean = false) => {
  if (reinit) {
    const targetWindow = createWindow("notification", "/notification", {
      height: 135,
      width: 200,
      alwaysOnTop: true,
    });
    targetWindow?.hide();
  }
  const fPath = getFileInfo("savePath");
  setTaskEndStatus(""); // 清空任务结束状态
  const taskId = nanoid();
  try {
    stopAbort.value = new AbortController();

    let scriptStr = "";

    if (!fPath) {
      scriptStr = tempEditorValue!.value;
    } else {
      scriptStr = transpile(await fsUtils.readFile(fPath), {
        target: ScriptTarget.ES2016,
      });
    }

    run(scriptStr, "fn" + taskId)();

    isInit.value = true;
    isReInit.value = true;

    const target = scriptList.value.find((s) => s.id === openId!.value);
    if (!target) return;

    if ((target.setting.targetApp ?? "") !== "" && target.setting.autoStartTargetApp) {
      const t = setTimeout(() => {
        cmdFn(target.setting.targetApp, true);
        clearTimeout(t);
      });
    }
  } catch (e: any) {
    running.value = 0;
    console.error(e);
  } finally {
    const t = setTimeout(() => {
      isLoading.value = false;
      clearTimeout(t);
    }, 300);
  }
};
const GlobalShortcutActions: Record<string, () => Promise<void> | void> = {
  invokeStartHandle,
  initScript,
  stop,
};
const GlobalShortcuts = [
  {
    key: "Shift+Alt+S",
    action: "invokeStartHandle",
  },
  {
    key: "Shift+Alt+R",
    action: "initScript",
  },
  {
    key: "Shift+Alt+D",
    action: "stop",
  },
];
const registerGlobalShortcuts = async (targetIndex: number) => {
  const targetShortcuts = GlobalShortcuts[targetIndex];
  if (targetShortcuts) {
    for (let i = 0; i < GlobalShortcuts.length; i++) {
      await unregister(GlobalShortcuts[i].key);
    }
    //注册当前快捷键
    register(targetShortcuts.key, () => {
      if (GlobalShortcutActions[targetShortcuts.action]) {
        GlobalShortcutActions[targetShortcuts.action]();
      }
    });
  }
};
watchEffect(async () => {
  if (!isInit.value && running.value !== 1) {
    return;
  }
  await registerGlobalShortcuts(running.value);
});

const isLoading = ref(true);
const handleMsg = (e: MessageEvent<any>) => {
  const { type } = e.data;
  if (type === "end") {
    stop();
  }
};
onMounted(async () => {
  initScript();
  const targetWindow = createWindow("notification", "/notification", {
    height: 135,
    width: 200,
    alwaysOnTop: true,
  });
  targetWindow?.hide();
  await registerGlobalShortcuts(running.value);
  register("Alt+Ctrl+S", () => {
    WebviewWindow.getByLabel("main")?.show();
  });
  notificationChannel.addEventListener("message", handleMsg);
});
onUnmounted(() => {
  //移除window.runTimeApi所有属性
  if ((window as any)["runTimeApi"]) {
    Object.keys((window as any).runTimeApi).forEach((key) => {
      delete (window as any).runTimeApi[key];
    });
  }
  //取消注册所有快捷键
  GlobalShortcuts.forEach((s) => {
    unregister(s.key);
  });
  unregister("Alt+Ctrl+S");
  notificationChannel.removeEventListener("message", handleMsg);
});
</script>

<style lang="scss" scoped>
.run-code-box {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  box-sizing: border-box;
  padding: 10px;
  .head-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    .s-name {
      font-size: 15px;
      font-weight: bold;
    }
    .icon {
      cursor: pointer;
      margin-left: 10px;
    }
  }

  .end-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px #eee solid;
    padding: 5px;
  }

  .console-log-div {
    margin-top: 10px;
    padding: 10px;
    flex: 1;
    // background-color: #3c3c3c;
    overflow-y: scroll;
    overflow-x: hidden;
    position: relative;

    .log-box {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;

      & > div:last-of-type {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        // justify-content: center;
        overflow: scroll;
        padding: 5px 0 0 0;
      }
      .alert-item {
        margin-bottom: 5px;
      }
    }
  }
}

.mgl-5 {
  margin-left: 5px;
  position: relative;
  .go-editor {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #00000074;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #fff;
    transition: opacity 0.5s;
    opacity: 0;
    &:hover {
      opacity: 1;
    }
  }
}
.mgl-10 {
  margin-left: 10px;
}
</style>
<style lang="scss">
.log-box {
  & > .el-card {
    & > .el-card__body {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
    }
  }
}
</style>
<style lang="scss">
.loading-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
