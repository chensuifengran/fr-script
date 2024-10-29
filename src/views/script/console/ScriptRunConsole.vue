<template>
  <div class="run-code-box">
    <common-header
      :title="title"
      :height="40"
      :allow-drag="false"
      @back="goBack"
      v-show="taskRunStatus !== 'running'"
    >
      <template #after>
        <div class="head-content">
          <el-tooltip effect="dark" content="编辑脚本" placement="bottom">
            <code-icon class="icon" @click.stop="goEditor" />
          </el-tooltip>
          <el-tooltip effect="dark" content="脚本设置" placement="bottom">
            <el-icon class="icon" @click.stop="goSetScript">
              <span i-solar-settings-linear></span>
            </el-icon>
          </el-tooltip>
          <el-checkbox
            class="mgl-10"
            v-model="hideWindow"
            label="运行时隐藏窗口"
            :disabled="isPlay"
          />
        </div>
      </template>
      <el-tooltip effect="dark" content="Ctrl+Shift+A" placement="bottom">
        <el-button
          @click="invokeStartHandle"
          v-show="taskRunStatus === 'ready'"
          plain
          :disabled="isLoading"
          >运行</el-button
        >
      </el-tooltip>
      <el-tooltip effect="dark" content="Ctrl+Shift+D" placement="bottom">
        <el-button
          @click="initScript(true)"
          v-show="taskRunStatus === 'done'"
          plain
          >重新初始化</el-button
        >
      </el-tooltip>
    </common-header>
    <div v-show="taskRunStatus === 'running'" class="end-box">
      <div class="info">
        <el-text truncated class="s-name"
          >{{ name || "未保存的临时脚本" }} :
          {{ version || "未知版本" }}</el-text
        >
        <el-tag class="mgl-5" size="small" type="info" v-show="savePath">{{
          savePath
        }}</el-tag>
        <el-tag class="mgl-5" size="small" type="success">运行中</el-tag>
        <DotLoader style="margin-left: 15px" />
      </div>
      <div class="op">
        <el-button
          @click="enableFloatWindow(false)"
          v-show="taskRunStatus === 'running'"
          :disabled="isPlay"
          type="primary"
          plain
          >小窗运行</el-button
        >
        <el-tooltip effect="dark" content="Ctrl+Shift+S" placement="bottom">
          <el-button
            @click="stop"
            v-show="taskRunStatus === 'running'"
            type="danger"
            plain
            >结束</el-button
          >
        </el-tooltip>
      </div>
    </div>
    <div class="console-log-div">
      <form-renderer
        :reInit="reInit"
        flex-1
        h-full
        mr-2
        :disabled-all="isLoading || taskRunStatus !== 'ready'"
      />
      <div
        h-full
        flex
        flex-col
        pos-relative
        :style="{
          width: taskRunStatus !== 'ready' ? '65%' : '220px',
        }"
      >
        <render-list-catalog
          scroll-container-id="renderer-form"
          v-if="taskRunStatus === 'ready'"
          class="catalog-box"
          w-full
          flex
          flex-1
        />
        <log-timeline
          :data="logOutput"
          w-full
          :style="{
            height: taskRunStatus !== 'ready' ? '100%' : '85px',
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  isRegistered,
  register,
  unregister,
} from "@tauri-apps/plugin-global-shortcut";
import {
  WebviewWindow,
  getCurrentWebviewWindow,
} from "@tauri-apps/api/webviewWindow";
import { nanoid } from "nanoid";
import { storeToRefs } from "pinia";
import { transpile, ScriptTarget } from "typescript";
import { devicesFn } from "../../../invokes/devices/exportFn";
import { disConnectToFn } from "../../../invokes/disConnectTo/exportFn";
import { connectToFn } from "../../../invokes/connectTo/exportFn";
import { cmdFn } from "../../../invokes/cmd/exportFn";
import { UnlistenFn } from "@tauri-apps/api/event";
import { ocrFn } from "../../../invokes/ocr/exportFn";
import { useLog } from "../../../hooks/useLog";
import { TaskRunStatus } from "../../../hooks/useScriptApi";
const { notify } = eventUtil;
const { taskRunStatus, name, version, hideWindow, savePath } = useScriptView();
const { logOutput } = useLog();
const { notAllowedFnId, runningFnId } = useScriptRuntime();
const isReInit = ref(false);
const isPlay = IS_PLAYGROUND_ENV;
const title = computed(() => {
  if (name.value) {
    return `[${version.value}]${name.value}`;
  }
  return "未保存的临时脚本";
});
const reInit = (): boolean => {
  if (isReInit.value) {
    isReInit.value = false;
    return true;
  }
  return false;
};
const shortcutsStore = useGlobalShortcutsStore();
const listStore = useListStore();
const { scriptList, renderList } = storeToRefs(listStore);
const { controlDeviceInfo } = useControl();
const { openId, tempEditorValue, contentTransform, asideBarPos } =
  useScriptInfo();
const goSetScript = () => {
  router.replace("/script/setting");
};

const { setEndBeforeCompletion, getFileInfo, getWillRunScript } =
  useScriptApi();

const goBack = async () => {
  router.replace("/script/list");
  asideBarPos.value = "relative";
  contentTransform.value = "translateX(0)";
  if (IS_PLAYGROUND_ENV) {
    return;
  }
  const targetWindow = await WebviewWindow.getByLabel("apiTest");
  targetWindow?.hide();
};
const goEditor = () => {
  contentTransform.value = "translateX(-100%)";
  asideBarPos.value = "absolute";
  //路由跳转到编辑器
  router.replace("/script/editor");
};
const builtInApi = useBuiltInApi();
const run = (script: string, runId: string) => {
  runningFnId.value = runId;
  window[CORE_NAMESPACES] = {
    ...builtInApi,
  };
  const runScript = getWillRunScript(runId, script);
  //参数列表为空
  return new Function("", runScript);
};
const { open } = windowUtil;
const enableFloatWindow = async (isInit: boolean = false) => {
  if (IS_PLAYGROUND_ENV) {
    return;
  }
  const appWindow = getCurrentWebviewWindow();
  appWindow.hide();
  const targetWindow = await open("notification", "/notification", {
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
      name: "continue",
      message: "",
    });
  }
};
const invokeStartHandle = async () => {
  const target = (
    IS_PLAYGROUND_ENV ? usePlayMock().mockScriptList : scriptList
  ).value.find((s) => s.id === openId!.value);
  if (!target) {
    builtInApi.Preludes.log("目标脚本不存在", "danger");
    return;
  }
  taskRunStatus.value = "running";
  setEndBeforeCompletion(false);
  if (hideWindow.value) {
    await enableFloatWindow(true);
  }
  const targetDevice = target.setting.targetAdbDevice?.trim() || "";
  if (targetDevice !== "" && !IS_PLAYGROUND_ENV) {
    //获得所有设备，取消非目标设备的连接
    const deviceList = (await devicesFn()) || [];
    const excludeDevices = [
      ...new Set([...deviceList, ...target.setting.excludeDevice]),
    ];
    for (let i = 0; i < excludeDevices?.length; i++) {
      builtInApi.Preludes.log(
        "尝试与设备断开连接：" + excludeDevices[i],
        "loading"
      );
      try {
        await disConnectToFn(excludeDevices[i]);
      } catch (e) {}
    }
    //连接目标设备
    builtInApi.Preludes.log("连接至设备：" + targetDevice, "loading");
    try {
      await connectToFn(targetDevice);
    } catch (error) {
      builtInApi.Preludes.log("连接设备失败：" + error, "danger");
      taskRunStatus.value = "ready";
      return;
    }
  }
  nextTick(() => {
    window[CORE_NAMESPACES].startScriptSignal?.abort();
    builtInApi.Preludes.log("脚本开始运行");
  });
};
const stop = () => {
  isInit.value = false;
  setEndBeforeCompletion(true);
  notAllowedFnId.value.push(runningFnId.value);
  builtInApi.abortSignalInScript && builtInApi.abortSignalInScript.abort();
  builtInApi.Preludes.log("脚本已强制结束", "warning", undefined, true);
  builtInApi.changeScriptRunState("stop");
  builtInApi.setTaskEndStatus("warning", "脚本已强制结束");
  console.log("脚本已停止，随着出现的报错为正常情况，不影响使用");
};
const isInit = ref(false);
const initScript = async (reinit: boolean = false) => {
  logOutput.splice(0, logOutput.length);
  builtInApi.Preludes.log("脚本初始化中", "loading");
  if (reinit && !IS_PLAYGROUND_ENV) {
    const targetWindow = await open("notification", "/notification", {
      height: 135,
      width: 200,
      alwaysOnTop: true,
    });
    targetWindow?.hide();
  }

  builtInApi.setTaskEndStatus(""); // 清空任务结束状态
  const taskId = nanoid();
  const appGSStore = useAppGlobalSettings();
  try {
    builtInApi.abortSignalInScript = new AbortController();
    let scriptStr = "";
    if (!IS_PLAYGROUND_ENV) {
      const fPath = getFileInfo("savePath");
      if (!fPath) {
        scriptStr = tempEditorValue!.value;
      } else {
        scriptStr = transpile(await fsUtils.readFile(fPath), {
          target: ScriptTarget.ESNext,
          removeComments: true,
        });
      }
      const target = scriptList.value.find((s) => s.id === openId!.value);
      if (
        target &&
        (target.setting.targetApp ?? "") !== "" &&
        target.setting.autoStartTargetApp
      ) {
        const t = setTimeout(() => {
          builtInApi.Preludes.log("启动目标应用中...", "loading");
          cmdFn(target.setting.targetApp, true);
          clearTimeout(t);
        });
      }
      if (appGSStore.ocr.value === "GPU") {
        if (await astWorker.methodIsInvoked(scriptStr, "ocr")) {
          builtInApi.Preludes.log(
            "[GPU]OCR服务预加载中，请耐心等待",
            "loading"
          );
          await ocrFn(0, 0, 1, 1);
        }
      }
    } else {
      scriptStr = getFileInfo("content") || "";
    }
    run(scriptStr, "fn" + taskId)();
    isInit.value = true;
    isReInit.value = true;
    builtInApi.Preludes.log("脚本已就绪,等待开始运行。", "loading");
  } catch (e: any) {
    taskRunStatus.value = "ready";
    console.error(e);
    builtInApi.Preludes.log(
      "脚本初始化失败：" + JSON.stringify(e),
      "danger",
      undefined,
      true
    );
  } finally {
    nextTick(() => {
      isLoading.value = false;
    });
  }
};
watch(
  () => controlDeviceInfo.executeScript,
  (v) => {
    if (v === "execute") {
      invokeStartHandle();
    } else if (v === "stop") {
      stop();
    } else if (v === "reinit") {
      initScript(true);
    }
  }
);
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
const registerGlobalShortcuts = (status: TaskRunStatus) => {
  if (IS_PLAYGROUND_ENV) {
    return;
  }
  const targetIndex =
    status === "running" ? 2 : taskRunStatus.value === "done" ? 1 : 0;
  timer && clearTimeout(timer);
  timer = setTimeout(async () => {
    clearTimeout(timer);
    const targetShortcuts = GlobalShortcuts[targetIndex];
    const shortcuts = shortcutsStore.getShortcuts(
      targetShortcuts.onlyDescription
    );
    if (targetShortcuts) {
      for (let i = 0; i < GlobalShortcuts.length; i++) {
        const shortcuts = shortcutsStore.getShortcuts(
          GlobalShortcuts[i].onlyDescription
        );
        if (await isRegistered(shortcuts)) {
          await unregister(shortcuts);
        }
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
  if (!isInit.value && taskRunStatus.value !== "done") {
    return;
  }
  if (IS_PLAYGROUND_ENV) {
    return;
  }
  registerGlobalShortcuts(taskRunStatus.value);
});

watch(taskRunStatus, (s) => {
  if (s === "running") {
    useWss().syncExecState("execute");
  } else if (s === "done") {
    useWss().syncExecState("stop");
  } else {
    useWss().syncExecState("reinit");
  }
});

const isLoading = ref(true);
let unlistenNotify: UnlistenFn;
let unlistenMsg: () => void;
onMounted(async () => {
  renderList.value.splice(0);
  initScript();
  unlistenMsg = useWss().onMsg((msg) => {
    if (msg.type === "COMMAND") {
      if (msg.command === "CHANGE_HIDE_WINDOW_STATE") {
        hideWindow.value = msg.hide;
      }
    }
  });
  if (IS_PLAYGROUND_ENV) {
    return;
  }
  const scriptRootDir = await pathUtils.resolve(
    getFileInfo("savePath") || "",
    "../"
  );
  useAppGlobalSettings().envSetting._scriptRootDir = scriptRootDir;
  const targetWindow = await open("notification", "/notification", {
    height: 135,
    width: 200,
    alwaysOnTop: true,
  });
  setTimeout(() => {
    targetWindow?.hide();
  });
  registerGlobalShortcuts(taskRunStatus.value);
  unlistenNotify = await notify.listen((data) => {
    const { type } = data.payload as { type: string; payload: any };
    if (type === "end") {
      stop();
    }
  });
});
onUnmounted(async () => {
  unlistenMsg();
  if (window[CORE_NAMESPACES]) {
    Object.keys(window[CORE_NAMESPACES]).forEach((key) => {
      //@ts-ignore
      delete window[CORE_NAMESPACES][key];
    });
  }
  if (IS_PLAYGROUND_ENV) {
    return;
  }
  for (const shortcut of GlobalShortcuts) {
    const _s = shortcutsStore.getShortcuts(shortcut.onlyDescription);
    if (await isRegistered(_s)) {
      await unregister(_s);
    }
  }
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
    position: relative;
    width: 100%;
    .info {
      width: calc(100% - 180px);
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .op {
      width: 180px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
    }
  }

  .console-log-div {
    margin-top: 10px;
    padding: 10px;
    height: calc(100vh - 102px);
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: row;
    transition: all 0.5s;
    .catalog-box {
      height: calc(100% - 85px);
      transition: all 0.5s;
      position: relative;
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
