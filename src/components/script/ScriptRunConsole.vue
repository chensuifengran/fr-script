<template>
  <div class="run-code-box">
    <el-page-header @back="goBack" v-show="running !== 2" title="脚本列表">
      <template #content>
        <span class="text-small font-200 flex items-center">
          {{ name || "未保存的临时脚本" }} : {{ version || "未知版本"
          }}<el-tag class="mgl-5" size="small" type="info" v-show="savePath"
            >{{ savePath }}
            <span class="go-editor" @click="goEditor"
              ><el-icon><IEpEdit /></el-icon
            ></span>
          </el-tag>
        </span>
      </template>
      <template #extra>
        <div class="flex items-center">
          <el-button @click="invokeStartHandle" v-show="running === 0"
            >开始<el-tag class="mgl-5" type="info" size="small">Alt+R</el-tag></el-button
          >
          <el-button @click="() => initScript(true)" v-show="running === 1"
            >重新初始化<el-tag class="mgl-5" type="info" size="small"
              >Alt+I</el-tag
            ></el-button
          >
        </div>
      </template>
    </el-page-header>
    <div v-show="running === 2" class="end-box">
      <span class="text-small font-200 flex items-center">
        {{ name || "未保存的临时脚本" }} : {{ version || "未知版本"
        }}<el-tag class="mgl-5" size="small" type="info" v-show="savePath">{{
          savePath
        }}</el-tag>
        <el-tag class="mgl-5" size="small" type="success">运行中</el-tag>
      </span>
      <el-button @click="stop" v-show="running === 2" type="danger"
        >结束<el-tag class="mgl-5" type="info" size="small">Alt+S</el-tag></el-button
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
            :type="log.type === 'danger' ? 'error' : log.type"
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
import { nanoid } from "nanoid";
import { storeToRefs } from "pinia";
import { transpile, ScriptTarget } from "typescript";
const { notAllowedFnId, runningFnId } = useScriptRuntime();
const isReInit = ref(false);
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
const { globalWindowInfo } = useWebviewWindow();

const running = ref(0);
const logOutput = reactive<
  {
    time: string;
    log: string;
    type: "success" | "danger" | "info" | "warning";
  }[]
>([]);
const clearLogOutput = () => logOutput.splice(0, logOutput.length);
const pushLog = async (log: string, type?: "success" | "danger" | "info" | "warning") => {
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
  //TODO通知
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
  const targetWindow = globalWindowInfo.value.windows.find((w) => w.label === "apiTest");
  if (targetWindow) {
    targetWindow.window.hide();
  }
};
const goEditor = () => {
  contentTransform.value = "translateX(-100%)";
  asideBarPos.value = "absolute";
  //路由跳转到编辑器
  router.replace("/script/editor");
};
const changeScriptRunState = (state: boolean | "stop", taskId?: string) => {
  if (taskId && taskId !== runningFnId.value) {
    return;
  }
  if (state === "stop") {
    running.value = 1;
    pushLog("脚本已强制结束", "warning");
    setTaskEndStatus("warning", "脚本已强制结束");
    //移除window.runTimeApi所有属性
    console.log("脚本已强制结束,移除window.runTimeApi所有属性");
    if ((window as any)["runTimeApi"]) {
      Object.keys((window as any).runTimeApi).forEach((key) => {
        delete (window as any).runTimeApi[key];
      });
    }
  } else if (state) {
    clearLogOutput();
    pushLog("脚本就绪，等待开始运行", "info");
    running.value = 0;
  } else {
    running.value = 1;
    pushLog("脚本执行完成", "success");
    setTaskEndStatus("success", "脚本执行完成");
    console.log("脚本执行完成,移除window.runTimeApi所有属性");
    //移除window.runTimeApi所有属性
    if ((window as any)["runTimeApi"]) {
      Object.keys((window as any).runTimeApi).forEach((key) => {
        delete (window as any).runTimeApi[key];
      });
    }
    //显示当前窗口
    // (window as any).api.changeWindowState("show", "main");
  }
};
onUnmounted(() => {
  console.log("移除window.runTimeApi所有属性");

  //移除window.runTimeApi所有属性
  if ((window as any)["runTimeApi"]) {
    Object.keys((window as any).runTimeApi).forEach((key) => {
      delete (window as any).runTimeApi[key];
    });
  }
});
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

const run = (script: string, runId: string) => {
  script = script.replace(/\/\*[^\/]*\*\/|\/\/.+\n?/g, "");
  // //TODO匹配script中的枚举类型KeyboardMap的枚举值，将其替换为keyMapObject对应的值
  // const keyMapObject = KeyMapObject;
  // script = script.replace(
  //   /KeyboardMap\[['"]([^'"]+)['"]\]|KeyboardMap\.([a-zA-Z$_][a-zA-Z$_0-9]*)/g,
  //   (_match, p1, p2) => {
  //     return `"${keyMapObject[p1 || p2]}"`;
  //   }
  // );

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
    SCREEN_SHOT_DIR: pathUtils.resolve(appGSStore.envSetting.screenshotSavePath, "../"),
    pushElementToSelectList,
    pushElementToCheckList,
    pushElementToMGSList,
    pushElementToGSList,
    pushElementToTableList,
    replaceRendererList,
    __httpValue: "http://",
    SCRIPT_ROOT_DIR: pathUtils.resolve(getFileInfo("savePath"), "../"),
    isStop: false,
    SCRIPT_ID: getScriptId(),
  };

  // (window as any).runTimeApi.RectUtil.runId = runId;
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
      changeScriptRunState('stop');
      abortSignalInScript = undefined;
      signal.removeEventListener('abort',signalHandle);
      isStop = true;
    }
    signal.addEventListener('abort',signalHandle);
    const evalFunction = async()=>{
      ${script}
      main && await main();
      changeScriptRunState && changeScriptRunState(false, '${runId}');
    }
    evalFunction();
  }

  `;
  //参数列表为空
  return new Function("", runScript);
};

const stopAbort = ref();
const invokeStartHandle = async () => {
  //隐藏当前窗口
  // (window as any).api.changeWindowState("hidden", "main");
  // (window as any).api.openNotificationWindow();
  running.value = 2;
  (window as any).runTimeApi.startScriptSignal?.abort();
  const target = scriptList.value.find((s) => s.id === openId!.value)!;
  const targetDevice = target.setting.targetAdbDevice.trim();
  if (targetDevice !== "") {
    //获得所有设备，取消非目标设备的连接
    // const devices =
    //   (await (window as any).runTimeApi.showDevices!())
    //     ?.split(",")
    //     .filter((i) => i.trim() !== targetDevice && i.trim() !== "") || [];
    // const excludeDevices = [...new Set([...devices, ...target.setting.excludeDevice])];
    const excludeDevices = target.setting.excludeDevice;

    for (let i = 0; i < excludeDevices?.length; i++) {
      console.log("与设备断开连接：", excludeDevices[i]);
      //TODO断开连接
      // await (window as any).runTimeApi.disConnectTo!(excludeDevices[i]);
    }
    //连接目标设备
    console.log("连接至设备：", targetDevice);
    //TODO连接设备
    // await (window as any).runTimeApi.connectTo!(targetDevice);
  }
};
const stop = () => {
  // (window as any).api.changeWindowState("show", "main");
  isInit.value = false;
  notAllowedFnId.value.push(runningFnId.value);
  stopAbort.value && stopAbort.value.abort();
  console.log("脚本已停止，随着出现的报错为正常情况，不影响使用");
};
const isInit = ref(false);
watchEffect(async () => {
  if (!isInit.value && running.value !== 1) {
    return;
  }
  //TODO 判断当前窗口是否为控制台窗口，如是则添加全局快捷键
  // if (curShow!.value === "console") {
  //   switch (running.value) {
  //     case 0:
  //       //快捷键启动脚本
  //       await (window as any).api.waitGlobalShortcutInvoke("Alt+r");
  //       (window as any).api.systemNotification("风染脚本", "脚本已启动，按Alt+s停止");
  //       invokeStartHandle();
  //       break;
  //     case 1:
  //       //快捷键重新初始化脚本
  //       await (window as any).api.waitGlobalShortcutInvoke("Alt+i");
  //       (window as any).api.systemNotification(
  //         "风染脚本",
  //         "脚本已重新初始化，按Alt+r启动"
  //       );
  //       initScript();
  //       break;
  //     case 2:
  //       //快捷键停止脚本
  //       await (window as any).api.waitGlobalShortcutInvoke("Alt+s");
  //       (window as any).api.systemNotification(
  //         "风染脚本",
  //         "脚本已停止，按Alt+i重新初始化"
  //       );
  //       stop();
  //       break;
  //   }
  // } else {
  //   (window as any).api.waitGlobalShortcutInvoke("closeAll");
  // }
});

const initScript = async (reinit: boolean = false) => {
  if (reinit) {
    // await (window as any).api.openNotificationWindow();
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

    const target = scriptList.value.find((s) => s.id === openId!.value)!;

    if ((target.setting.targetApp ?? "") !== "" && target.setting.autoStartTargetApp) {
      const t = setTimeout(() => {
        //TODO自动启动目标应用
        // allRunTimeApi.execCommand(target.setting.targetApp, true);
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

const isLoading = ref(true);
onMounted(() => {
  initScript();
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

    // .occupy_space_div {
    //   width: 100%;
    //   height: 200px;
    //   opacity: 0;
    // }
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
