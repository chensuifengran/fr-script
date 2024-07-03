<template>
  <div class="run-code-box">
    <el-page-header @back="goBack" v-show="running !== 2" title="脚本列表">
      <template #content>
        <div class="head-content">
          <span class="s-name">{{ name || "未保存的临时脚本" }} : {{ version || "未知版本" }}</span>
          <el-tooltip effect="dark" content="编辑脚本" placement="bottom">
            <code-icon class="icon" @click.stop="goEditor" />
          </el-tooltip>
          <el-tooltip effect="dark" content="脚本设置" placement="bottom">
            <el-icon class="icon" @click.stop="goSetScript">
              <span i-solar-settings-linear></span>
            </el-icon>
          </el-tooltip>
          <el-checkbox class="mgl-10" v-model="hideWindow" label="运行时隐藏窗口" />
        </div>
      </template>
      <template #extra>
        <div>
          <el-tooltip effect="dark" content="Ctrl+Shift+A" placement="bottom">
            <el-button @click="invokeStartHandle" v-show="running === 0" plain>运行</el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="Ctrl+Shift+D" placement="bottom">
            <el-button @click="() => initScript(true)" v-show="running === 1" plain>重新初始化</el-button>
          </el-tooltip>
        </div>
      </template>
    </el-page-header>
    <div v-show="running === 2" class="end-box">
      <div>
        <span class="s-name">{{ name || "未保存的临时脚本" }} : {{ version || "未知版本" }}</span>
        <el-tag class="mgl-5" size="small" type="info" v-show="savePath">{{
          savePath
        }}</el-tag>
        <el-tag class="mgl-5" size="small" type="success">运行中</el-tag>
        <DotLoader style="margin-left: 15px" />
      </div>
      <div>
        <el-button @click="enableFloatWindow(false)" v-show="running === 2" type="primary" plain>小窗运行</el-button>
        <el-tooltip effect="dark" content="Ctrl+Shift+S" placement="bottom">
          <el-button @click="stop" v-show="running === 2" type="danger" plain>结束</el-button>
        </el-tooltip>
      </div>
    </div>
    <div class="console-log-div" v-show="!isLoading">
      <async-renderer-form v-show="running === 0" :reInit="reInit" />
      <log-timeline v-show="running !== 0" :data="logOutput" />
    </div>
  </div>
  <teleport to="body">
    <div class="loading-box" v-if="isLoading">
      <loading />
      <div>脚本初始化中,OCR服务为GPU时首次加载需要较长时间...</div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { isRegistered, register, unregister } from "@tauri-apps/api/globalShortcut";
import { WebviewWindow, appWindow } from "@tauri-apps/api/window";
import { nanoid } from "nanoid";
import { storeToRefs } from "pinia";
import { transpile, ScriptTarget } from "typescript";
import { devicesFn } from "../../invokes/devices/exportFn";
import { disConnectToFn } from "../../invokes/disConnectTo/exportFn";
import { connectToFn } from "../../invokes/connectTo/exportFn";
import { cmdFn } from "../../invokes/cmd/exportFn";
import { UnlistenFn } from "@tauri-apps/api/event";
import { ocrFn } from "../../invokes/ocr/exportFn";
const { notify } = eventUtil;
const AsyncRendererForm = defineAsyncComponent(
  () => import("@/components/script/RendererForm.vue")
);

const { running, name, version, hideWindow, savePath, logOutput } = useScriptView();
const { notAllowedFnId, runningFnId } = useScriptRuntime();
const isReInit = ref(false);

const reInit = (): boolean => {
  if (isReInit.value) {
    isReInit.value = false;
    return true;
  }
  return false;
};
const shortcutsStore = useGlobalShortcutsStore();
const listStore = useListStore();
const { scriptList } = storeToRefs(listStore);

const { openId, tempEditorValue, contentTransform, asideBarPos } = useScriptInfo();
const goSetScript = () => {
  router.replace("/script/setting");
};

const { setEndBeforeCompletion, getFileInfo, getWillRunScript } = useScriptApi()!;

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
const builtInApi = useBuiltInApi();
const run = (script: string, runId: string) => {
  script = script.replace(ANNOTATION_REGEX, "");
  runningFnId.value = runId;
  window[CORE_NAMESPACES] = {
    ...builtInApi,
  };
  const runScript = getWillRunScript(runId, script);
  //参数列表为空
  return new Function("", runScript);
};
const { createWindow } = useWebviewWindow();
const enableFloatWindow = async (isInit: boolean = false) => {
  appWindow.hide();
  const targetWindow = createWindow("notification", "/notification", {
    height: 40,
    width: 300,
    alwaysOnTop: true,
  });
  await targetWindow?.show();
  if (isInit) {
    await notify.init({
      name: name.value,
    });
  } else {
    await notify.sendCustom({
      name: 'continue',
      message: ''
    })
  }
};
const invokeStartHandle = async () => {
  setEndBeforeCompletion(false);
  if (hideWindow.value) {
    await enableFloatWindow(true);
  }
  running.value = 2;
  window[CORE_NAMESPACES].startScriptSignal?.abort();
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
  setEndBeforeCompletion(true);
  notAllowedFnId.value.push(runningFnId.value);
  builtInApi.changeScriptRunState("stop");
  builtInApi.log("脚本已强制结束", "warning");
  builtInApi.setTaskEndStatus("warning", "脚本已强制结束");
  builtInApi.abortSignalInScript && builtInApi.abortSignalInScript.abort();
  console.log("脚本已停止，随着出现的报错为正常情况，不影响使用");
};
const isInit = ref(false);
const initScript = async (reinit: boolean = false) => {
  logOutput.splice(0, logOutput.length);
  if (reinit) {
    const targetWindow = createWindow("notification", "/notification", {
      height: 135,
      width: 200,
      alwaysOnTop: true,
    });
    targetWindow?.hide();
  }
  const fPath = getFileInfo("savePath");
  builtInApi.setTaskEndStatus(""); // 清空任务结束状态
  const taskId = nanoid();
  const appGSStore = useAppGlobalSettings();
  try {
    builtInApi.abortSignalInScript = new AbortController();
    let scriptStr = "";
    if (!fPath) {
      scriptStr = tempEditorValue!.value;
    } else {
      scriptStr = transpile(await fsUtils.readFile(fPath), {
        target: ScriptTarget.ESNext,
      });
    }
    if (
      appGSStore.ocr.value === "GPU" &&
      scriptStr.replace(ANNOTATION_REGEX, "").includes("ocr")
    ) {
      await ocrFn(0, 0, 1, 1);
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
    onlyDescription: "运行脚本",
    action: "invokeStartHandle",
  },
  {
    onlyDescription: "重新初始化脚本",
    action: "initScript",
  },
  {
    onlyDescription: "强制停止脚本",
    action: "stop",
  },
];
let timer: NodeJS.Timeout;
const registerGlobalShortcuts = (targetIndex: number) => {
  timer && clearTimeout(timer);
  timer = setTimeout(async () => {
    clearTimeout(timer);
    const targetShortcuts = GlobalShortcuts[targetIndex];
    const shortcuts = shortcutsStore.getShortcuts(targetShortcuts.onlyDescription);
    if (targetShortcuts) {
      for (let i = 0; i < GlobalShortcuts.length; i++) {
        const shortcuts = shortcutsStore.getShortcuts(GlobalShortcuts[i].onlyDescription);
        await unregister(shortcuts);
      }
      if (!(await isRegistered(shortcuts))) {
        register(shortcuts, () => {
          if (GlobalShortcutActions[targetShortcuts.action]) {
            GlobalShortcutActions[targetShortcuts.action]();
          }
        });
      }
    }
  }, 300);
};
watchEffect(async () => {
  if (!isInit.value && running.value !== 1) {
    return;
  }
  registerGlobalShortcuts(running.value);
});

const isLoading = ref(true);
let unlistenNotify: UnlistenFn;
onMounted(async () => {
  initScript();
  const targetWindow = createWindow("notification", "/notification", {
    height: 135,
    width: 200,
    alwaysOnTop: true,
  });
  setTimeout(() => {
    targetWindow?.hide();
  });
  registerGlobalShortcuts(running.value);
  unlistenNotify = await notify.listen((data) => {
    const { type } = data.payload as { type: string; payload: any };
    if (type === "end") {
      stop();
    }
  });
});
onUnmounted(() => {
  if (window[CORE_NAMESPACES]) {
    Object.keys(window[CORE_NAMESPACES]).forEach((key) => {
      //@ts-ignore
      delete window[CORE_NAMESPACES][key];
    });
  }
  //取消注册所有快捷键
  GlobalShortcuts.forEach((s) => {
    const shortcuts = shortcutsStore.getShortcuts(s.onlyDescription);
    unregister(shortcuts);
  });
  unlistenNotify();
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

      &>div:last-of-type {
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
  &>.el-card {
    &>.el-card__body {
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
