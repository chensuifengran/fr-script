<script setup lang="ts">
import { storeToRefs } from "pinia";
import { getVersion } from "@tauri-apps/api/app";
import { relaunch } from "@tauri-apps/plugin-process";
import { enable, isEnabled, disable } from "@tauri-apps/plugin-autostart";
import { ElButton } from "element-plus";
import {
  WebviewWindow,
  getCurrentWebviewWindow,
} from "@tauri-apps/api/webviewWindow";
import { UnlistenFn, listen } from "@tauri-apps/api/event";
import MoonIcon from "../components/Icons/MoonIcon.vue";
import SunIcon from "../components/Icons/SunIcon.vue";
const autoStart = ref(false);
watch(autoStart, async (value) => {
  if (IS_PLAYGROUND_ENV) {
    return;
  }
  if (value) {
    await enable();
  } else {
    await disable();
  }
});
const { getDepStateType } = libUtil;
const { goInstallDeps, syncData } = useDepInfo();
const { selectFile, selectDir } = fsUtils;
const version = ref(IS_PLAYGROUND_ENV ? "playground" : "获取版本失败");
const loading = ref(false);
const loadingText = ref("");
const libDownloadDialog = ref(false);
const appGSStore = useAppGlobalSettings();
const { app, envSetting, ocr, view, editor } = storeToRefs(appGSStore);
const { isDark } = useAppTheme();
const darkState = ref(false);
if (!IS_PLAYGROUND_ENV) {
  getVersion().then((res) => {
    version.value = res;
  });
}
darkState.value = isDark.value;
let timer: any;
watch(darkState, () => {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    isDark.value = darkState.value;
  }, 300);
});
const chooseWorkDir = async () => {
  if (IS_PLAYGROUND_ENV) {
    //playground环境
    envSetting.value.workDir = "E:\\\\fr-script\\\\workdir";
    return;
  }
  const res = await selectDir();
  if (res) {
    envSetting.value.workDir = res;
  }
};
const chooseScreenshotSavePath = async () => {
  if (IS_PLAYGROUND_ENV) {
    envSetting.value.screenshotSavePath =
      "E:\\\\fr-script\\\\workdir\\\\screenshot.png";
    return;
  }
  const res = (await selectFile(false)) as string | undefined;
  if (res) {
    envSetting.value.screenshotSavePath = res;
  }
};
const libCGSwitch = async (target: string, name: string) => {
  if (IS_PLAYGROUND_ENV) {
    //playground环境
    return true;
  }
  try {
    const p_inference = await libUtil.libExists("paddle_inference.dll");
    const libInfo = await libUtil.libExists(name);
    if (libInfo && p_inference) {
      if (p_inference.fileSize > 0 && p_inference.fileSize / 1024000 < 100) {
        //cpu
        if (target === "GPU") {
          const libExists = await libUtil.libExists("g_" + name);
          if (libExists) {
            loading.value = true;
            loadingText.value = "正在切换到" + target + "库，请稍后...";
            //存在则把该文件重命名为name
            await libUtil.renameLib(name, "c_" + name);
            await libUtil.renameLib("g_" + name, name);
            loading.value = false;
            return true;
          } else {
            //提示下载导入对应版本的依赖库
            libDownloadDialog.value = true;
          }
        } else {
          return true;
        }
      } else if (
        p_inference.fileSize > 0 &&
        p_inference.fileSize / 1024000 > 100
      ) {
        //gpu
        if (target === "CPU") {
          const libExists = await libUtil.libExists("c_" + name);
          if (libExists) {
            loading.value = true;
            loadingText.value = "正在切换到" + target + "库，请稍后...";
            //存在则把该文件重命名为name
            await libUtil.renameLib(name, "g_" + name);
            await libUtil.renameLib("c_" + name, name);
            loading.value = false;
            return true;
          } else {
            //提示下载导入对应版本的依赖库
            libDownloadDialog.value = true;
          }
        } else {
          return true;
        }
      }
    } else {
      //不存在则判断对应前缀的文件是否存在
      let prefix = "";
      if (target === "CPU") {
        prefix = "c_";
      } else {
        prefix = "g_";
      }
      const libExists = await libUtil.libExists(prefix + name);
      if (libExists) {
        //存在则把该文件重命名为name
        loading.value = true;
        loadingText.value = "正在切换到" + target + "库，请稍后...";
        await libUtil.renameLib(prefix + name, name);
        loading.value = false;
        return true;
      } else {
        //提示下载导入对应版本的依赖库
        libDownloadDialog.value = true;
      }
    }
    return false;
  } catch (error) {
    return false;
  }
};
const checkTargetLib = async (target: "CPU" | "GPU") => {
  if (IS_PLAYGROUND_ENV) {
    return true;
  }
  if (target === "CPU") {
    const libInferExists = await libUtil.libExists("c_paddle_inference.dll");
    const libExists = await libUtil.libExists("c_ppocr.dll");
    return !!libInferExists && !!libExists;
  } else {
    const libInferExists = await libUtil.libExists("g_paddle_inference.dll");
    const libExists = await libUtil.libExists("g_ppocr.dll");
    return !!libInferExists && !!libExists;
  }
};
let showMessage = true;
const switchOcrLib = async (target: "CPU" | "GPU", checkExists = true) => {
  try {
    const allowSwitch = await checkTargetLib(target);
    if (checkExists && !allowSwitch) {
      showMessage && ElMessage.error("切换失败,目标依赖缺失！");
      ocr.value.value = ocr.value.value === "CPU" ? "GPU" : "CPU";
      return;
    }
    const switchPpocrLib = await libCGSwitch(target, "ppocr.dll");
    const switchPaddleInferenceLib = await libCGSwitch(
      target,
      "paddle_inference.dll"
    );
    if (switchPpocrLib && switchPaddleInferenceLib) {
      if (showMessage) {
        ElNotification({
          title: "切换OCR运行方式",
          dangerouslyUseHTMLString: true,
          position: "bottom-right",
          message: h(
            "div",
            {
              class: "notification-message-div",
            },
            [
              "重启软件后生效",
              h(
                ElButton,
                {
                  size: "small",
                  class: "notification-message-button",
                  type: "primary",
                  onClick: () => {
                    if (IS_PLAYGROUND_ENV) {
                      //playground环境
                      return;
                    }
                    relaunch();
                  },
                },
                "立即重启"
              ),
            ]
          ),
          type: "success",
          duration: 3000,
        });
      } else {
        showMessage = true;
      }
    } else {
      if (showMessage) {
        ElMessage.error("切换失败");
        ocr.value.value = ocr.value.value === "CPU" ? "GPU" : "CPU";
      } else {
        showMessage = true;
      }
    }
  } catch (error) {
    showMessage && ElMessage.error("切换失败");
    ocr.value.value = ocr.value.value === "CPU" ? "GPU" : "CPU";
  }
};
const switchOcrRunType = async () => {
  await switchOcrLib(ocr.value.value);
};
const haveUpdate = computed(() => {
  if (IS_PLAYGROUND_ENV) {
    return false;
  }
  if (version.value === "获取版本失败") {
    return false;
  }
  const res = compareVersions(version.value, appGSStore.app.latestVersion);
  return res < 0;
});
const themeChangeHandler = async () => {
  if (IS_PLAYGROUND_ENV) {
    return;
  }
  const notifyWindow = await WebviewWindow.getByLabel("notification");
  if (notifyWindow) {
    //主题切换时需关闭隐藏的通知窗口，否则主题切换会出现样式问题
    notifyWindow.close();
  }
};
const { goAppUpdate } = useAppVersionInfo();
const { notify } = eventUtil;
let focusUnListenFn: UnlistenFn;
let receiveUnListenFn: UnlistenFn;
onMounted(async () => {
  if (IS_PLAYGROUND_ENV) {
    return;
  }
  const appWindow = getCurrentWebviewWindow();
  autoStart.value = await isEnabled();
  await libUtil.syncDependentVersion();
  const currentWindowLabel = appWindow.label;
  if (currentWindowLabel === "main") {
    focusUnListenFn = await listen("tauri://focus", async () => {
      const depManagerWindow = await WebviewWindow.getByLabel("depManager");
      if (depManagerWindow) {
        notify.send({
          name: "sentDataToMain",
        });
      }
    });
    receiveUnListenFn = await notify.listen(async (event) => {
      const { payload } = event.payload;
      if (payload.name === "syncMainData") {
        const data = payload.payload;
        syncData(data);
      }
    }, "depManager");
  }
  invokeBaseApi.closeSplashscreen();
});
onUnmounted(() => {
  if (IS_PLAYGROUND_ENV) {
    return;
  }
  focusUnListenFn && focusUnListenFn();
  receiveUnListenFn && receiveUnListenFn();
});
</script>
<template>
  <div
    class="setting-div"
    v-loading="loading"
    :element-loading-text="loadingText"
  >
    <el-dialog v-model="libDownloadDialog" title="未发现依赖库">
      <div class="dialog-content">
        <span>错误，依赖文件缺失!</span>
        <div class="btn-content">
          <el-button type="info" @click="libDownloadDialog = false"
            >取消</el-button
          >
          <el-button type="primary" @click="goInstallDeps()"
            >依赖管理</el-button
          >
        </div>
      </div>
    </el-dialog>
    <h3 class="setting-title">App</h3>
    <div class="setting-item">
      <span>版本</span>
      <span
        ><el-tag
          :type="haveUpdate ? 'info' : 'primary'"
          class="mr-5"
          size="small"
          >{{ version }}</el-tag
        ><el-tag class="mr-5" size="small" v-if="haveUpdate"
          >最新版本：{{ appGSStore.app.latestVersion }}</el-tag
        ><el-button link type="primary" @click="goAppUpdate(haveUpdate)"
          >{{ haveUpdate ? "前往" : "检查" }}更新</el-button
        ></span
      >
    </div>
    <div class="setting-item">
      <span>开机自启</span>
      <el-switch v-model="autoStart" />
    </div>
    <div class="setting-item">
      <span>依赖状态</span>
      <span
        ><el-tag
          :type="getDepStateType(app.dependenceState)"
          class="mr-5"
          size="small"
          >{{ app.dependenceState }}</el-tag
        ><el-tag
          v-if="app.depHaveUpdate"
          type="warning"
          class="mr-5"
          size="small"
          >可更新</el-tag
        ><el-button
          link
          type="primary"
          @click="
            goInstallDeps(
              app.depHaveUpdate ? 'haveUpdateDep' : 'lackDepDownload'
            )
          "
          >依赖管理</el-button
        ></span
      >
    </div>
    <div class="setting-item">
      <span>全局主题</span>
      <el-switch
        v-model="darkState"
        :active-icon="MoonIcon"
        :inactive-icon="SunIcon"
        @change="themeChangeHandler"
      />
    </div>
    <h3 class="setting-title" v-if="app.dependenceState !== '不可用'">
      OCR服务
    </h3>
    <div v-if="app.dependenceState !== '不可用'" class="setting-item">
      <span>运行方式</span>
      <el-select
        v-model="ocr.value"
        placeholder="OCR运行方式"
        size="small"
        class="w120"
        @change="switchOcrRunType"
        :disabled="app.dependenceState !== '完整版'"
      >
        <el-option
          v-for="item in ocr.options"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <div class="setting-item" v-show="ocr.value === 'GPU'">
      <span>GPU内存占用(MB)</span>
      <el-input-number v-model="ocr.gpuMemory" :min="1" size="small" />
    </div>
    <h3 class="setting-title">环境设置</h3>
    <div class="setting-item">
      <span>工作目录</span>
      <span
        ><el-tag type="info" class="mr-5" size="small">{{
          envSetting.workDir
        }}</el-tag
        ><el-button link type="primary" @click="chooseWorkDir"
          >选择</el-button
        ></span
      >
    </div>
    <div class="setting-item">
      <span>截图保存路径</span>
      <span
        ><el-tag type="info" class="mr-5" size="small">{{
          envSetting.screenshotSavePath
        }}</el-tag
        ><el-button link type="primary" @click="chooseScreenshotSavePath"
          >选择</el-button
        ></span
      >
    </div>
    <h3 class="setting-title">显示</h3>
    <div class="setting-item">
      <span>在标题栏显示APP更新按钮</span>
      <el-select
        v-model="view.showUpdateInTitleBar"
        placeholder="在标题栏显示APP更新按钮"
        size="small"
        class="w120"
      >
        <el-option label="显示" :value="true" />
        <el-option label="不显示" :value="false" />
      </el-select>
    </div>
    <h3 class="setting-title">编辑器</h3>
    <div class="setting-item">
      <span>主题</span>
      <el-select
        v-model="editor.theme.value"
        placeholder="编辑器主题"
        size="small"
        class="w120"
      >
        <el-option
          v-for="item in editor.theme.options"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <div class="setting-item">
      <span>点击运行时自动保存</span>
      <el-switch v-model="editor.runAutoSave" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.mr-5 {
  margin-right: 5px;
}

.w120 {
  width: 120px;
}

.setting-div {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 5px 10px;
  box-sizing: border-box;
  overflow-y: scroll;

  .dialog-content {
    display: flex;
    flex-direction: column;
    padding: 10px;

    .btn-content {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      margin-top: 20px;
    }
  }

  .setting-title {
    margin: 5px 0;
  }

  .setting-item {
    display: flex;
    width: 100%;
    height: 40px;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 15px;
    padding-right: 15px;
    border-radius: 20px;
    box-sizing: border-box;
    align-items: center;
    transition: all 0.3s;

    &:hover {
      background: var(--el-color-primary-light-9);
    }
  }
}
</style>
<style lang="scss">
.setting-item .el-switch__label * {
  font-size: large;
}

.el-notification__group {
  flex: 1;

  .notification-message-div {
    width: 100%;
    line-height: 20px;
    height: 40px;
    position: relative;

    .notification-message-button {
      position: absolute;
      right: -20px;
      bottom: -5px;
    }
  }
}
</style>
