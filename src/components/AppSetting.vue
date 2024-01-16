<script setup lang="ts">
import { Sunny, Moon } from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";
import { getVersion } from "@tauri-apps/api/app";
import { relaunch } from "@tauri-apps/api/process";
import { ElButton } from "element-plus";

const { selectFile, selectDir } = pathUtils;
const version = ref("获取版本失败");
getVersion().then((res) => {
  version.value = res;
});
const loading = ref(false);
const loadingText = ref("");
const libDownloadDialog = ref(false);
const appGSStore = useAppGlobalSettings();
const { app, envSetting, ocr } = storeToRefs(appGSStore);
const isDark = inject<globalThis.WritableComputedRef<boolean>>("isDark")!;
const darkState = ref(false);
darkState.value = isDark.value;
let timer: any;
watch(darkState, () => {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    isDark.value = darkState.value;
  }, 300);
});
const chooseWorkDir = async () => {
  const res = await selectDir();
  if (res) {
    envSetting.value.workDir = res;
  }
};
const chooseScreenshotSavePath = async () => {
  const res = (await selectFile()) as string | undefined;
  if (res) {
    envSetting.value.screenshotSavePath = res;
  }
};
const libCGSwitch = async (target: string, name: string) => {
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
      } else if (p_inference.fileSize > 0 && p_inference.fileSize / 1024000 > 100) {
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
let showMessage = true;
const switchOcrLib = async (target: "CPU" | "GPU") => {
  try {
    const switchPpocrLib = await libCGSwitch(target, "ppocr.dll");
    const switchPaddleInferenceLib = await libCGSwitch(target, "paddle_inference.dll");
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
  return (
    version.value !== "获取版本失败" && version.value !== appGSStore.app.latestVersion
  );
});
const getDepStateType = (state: string) => {
  switch (state) {
    case "完整版":
      return "success";
    case "不可用":
      return "danger";
    case "精简版":
      return "warning";
    default:
      return "info";
  }
};
const { goInstallDeps } = useDepInfo();
</script>
<template>
  <div class="setting-div" v-loading="loading" :element-loading-text="loadingText">
    <el-dialog v-model="libDownloadDialog" title="未发现依赖库">
      <div class="dialog-content">
        <p>未发现依赖库，请先下载对应的依赖库，再使用导入功能导入该依赖库</p>
        <el-button type="primary">下载</el-button>
        <el-button type="primary">导入</el-button>
      </div>
    </el-dialog>
    <h3>App</h3>
    <div class="setting-item">
      <span>版本</span>
      <span
        ><el-tag type="info" class="mr-5" size="small">{{ version }}</el-tag
        ><el-tag type="success" class="mr-5" size="small" v-if="haveUpdate"
          >最新版本：{{ appGSStore.app.latestVersion }}</el-tag
        ><el-button link type="primary"
          >{{ haveUpdate ? "前往" : "检查" }}更新</el-button
        ></span
      >
    </div>
    <div class="setting-item">
      <span>依赖状态</span>
      <span
        ><el-tag :type="getDepStateType(app.dependenceState)" class="mr-5" size="small">{{
          app.dependenceState
        }}</el-tag
        ><el-tag v-if="app.depHaveUpdate" type="warning" class="mr-5" size="small"
          >可更新</el-tag
        ><el-button
          link
          type="primary"
          v-if="app.dependenceState !== '完整版'"
          @click="goInstallDeps"
          >安装依赖</el-button
        ><el-button link type="primary">{{
          app.depHaveUpdate ? "更新" : "检查更新"
        }}</el-button></span
      >
    </div>
    <div class="setting-item">
      <span>全局主题</span>
      <el-switch v-model="darkState" :active-icon="Moon" :inactive-icon="Sunny" />
    </div>
    <div class="setting-item">
      <span>编辑器主题</span>
      <el-select
        v-model="app.editorTheme.value"
        placeholder="编辑器主题"
        size="small"
        class="w120"
      >
        <el-option
          v-for="item in app.editorTheme.options"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <h3 v-if="app.dependenceState !== '不可用'">OCR服务</h3>
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
        <el-option v-for="item in ocr.options" :key="item" :label="item" :value="item" />
      </el-select>
    </div>
    <div class="setting-item" v-show="ocr.value === 'GPU'">
      <span>GPU内存占用(MB)</span>
      <el-input-number v-model="ocr.gpuMemory" :min="1" size="small" />
    </div>
    <h3>环境设置</h3>
    <div class="setting-item">
      <span>工作目录</span>
      <span
        ><el-tag type="info" class="mr-5" size="small">{{ envSetting.workDir }}</el-tag
        ><el-button link type="primary" @click="chooseWorkDir">选择</el-button></span
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
    <div class="setting-item">
      <span>临时文件保存盘符</span>
      <el-select
        v-model="envSetting.tempDrivePath.value"
        placeholder="临时文件保存盘符"
        size="small"
        class="w120"
      >
        <el-option
          v-for="item in envSetting.tempDrivePath.options"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
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
