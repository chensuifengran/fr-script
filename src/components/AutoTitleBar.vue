<template>
  <!-- 退出提醒弹窗 -->
  <el-dialog v-model="showQuitDialog" title="退出程序">
    <div>确定要退出程序吗?</div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showQuitDialog = false">取消</el-button>
        <el-button type="danger" @click="closeHandle">{{ isEditing ? "保存并" : "" }}退出</el-button>
      </span>
    </template>
  </el-dialog>
  <transition enter-active-class="animate__animated animate__fadeInUp"
    leave-active-class="animate__animated animate__fadeOutDown">
    <div data-tauri-drag-region class="titlebar" v-if="!isEditing" style="cursor: move">
      <div class="title" data-tauri-drag-region style="cursor: move">
        <div class="text">
          <el-image style="width: 20px; height: 20px" :src="icon" /><span>{{
            info.title
          }}</span>
        </div>
        <transition enter-active-class="animate__animated animate__fadeInUp"
          leave-active-class="animate__animated animate__fadeOutDown">
          <div class="api-test-bar" data-tauri-drag-region v-if="showApiTestSearch" style="cursor: move">
            <el-input class="search-ipt" v-model="info.apiTest.searchValue" clearable placeholder="可输入API的关键字对API进行筛选">
            </el-input>
            <el-button class="output-btn" @click="info.apiTest.openOutput = true" circle><el-icon>
                <span i-mdi-square-rounded-badge-outline></span>
              </el-icon></el-button>
          </div>
        </transition>
      </div>
      <div class="btn">
        <el-tooltip effect="light" content="基础功能不可用，点我安装依赖" placement="bottom"
          v-if="appGSStore.app.dependenceState === '不可用'">
          <div class="titlebar-button warning-btn" @click="goInstallDeps()">
            <el-icon>
              <span i-mdi-tools></span>
            </el-icon>
          </div>
        </el-tooltip>
        <el-tooltip effect="light" content="有新版本，点我更新" placement="bottom"
          v-if="showSetupBtn && appGSStore.view.showUpdateInTitleBar">
          <div class="titlebar-button setup-btn" @click="openDownloadDialog">
            <el-icon>
              <span i-mdi-cloud-download-outline></span>
            </el-icon>
          </div>
        </el-tooltip>

        <div class="titlebar-button" @click="!isEditing && toggleMostTop()">
          <el-icon>
            <span i-solar-pin-bold-duotone :style="{
              color: mostTop ? 'var(--el-color-primary)' : 'var(--color)'
            }"></span>
          </el-icon>
        </div>
        <div class="titlebar-button" @click="!isEditing && minHandle()">
          <el-icon>
            <span i-mdi-minus></span>
          </el-icon>
        </div>
        <div class="titlebar-button" @click="!isEditing && maxHandle()">
          <el-icon>
            <span v-if="!isFullScreen" i-mdi-fullscreen></span>
            <span v-else i-mdi-fullscreen-exit></span>
          </el-icon>
        </div>
        <div class="titlebar-button danger" @click="!isEditing && (showQuitDialog = true)">
          <el-icon>
            <span i-mdi-window-close></span>
          </el-icon>
        </div>
      </div>
    </div>
    <div class="titlebar" data-tauri-drag-region v-else-if="isEditing" style="cursor: move">
      <EditorHeader>
        <div class="btn-content">
          <div class="titlebar-button" @click="isEditing && toggleMostTop()">
            <span i-solar-pin-bold-duotone :style="{
              color: mostTop ? 'var(--el-color-primary)' : 'var(--color)'
            }" />
          </div>
          <div class="titlebar-button" @click="isEditing && minHandle()">
            <el-icon>
              <span i-mdi-minus></span>
            </el-icon>
          </div>
          <div class="titlebar-button" @click="isEditing && maxHandle()">
            <el-icon>
              <span v-if="!isFullScreen" i-mdi-fullscreen></span>
              <span v-else i-mdi-fullscreen-exit></span>
            </el-icon>
          </div>
          <div class="titlebar-button danger" @click="isEditing && (showQuitDialog = true)">
            <el-icon>
              <span i-mdi-window-close></span>
            </el-icon>
          </div>
        </div>
      </EditorHeader>
    </div>
  </transition>
</template>
<script lang="ts" setup>
import { appWindow, getAll, getCurrent } from "@tauri-apps/api/window";
import icon from "../assets/icon64x64.png";
import { getVersion } from "@tauri-apps/api/app";
import { listen } from "@tauri-apps/api/event";
const { info, windowInnerWidth, clickMinimize } = useAutoTitleBar();
const { goInstallDeps } = useDepInfo();
const { isEditing, fileInfo } = useScriptInfo();
const { getEditorValue } = useEditor();
const mostTop = ref(false);
const toggleMostTop = () => {
  mostTop.value = !mostTop.value;
  if (mostTop.value) {
    appWindow.setAlwaysOnTop(true);
  } else {
    appWindow.setAlwaysOnTop(false);
  }
};
const titleBarHeight = computed(() => {
  return isEditing.value ? "35px" : "40px";
});
const showQuitDialog = ref(false);
const minHandle = () => {
  clickMinimize.value = true;
  appWindow.minimize();
};
const maxHandle = async () => {
  if (await appWindow.isMaximized()) {
    appWindow.unmaximize();
    isFullScreen.value = false;
  } else {
    isFullScreen.value = true;
    appWindow.maximize();
  }
};
const closeHandle = async () => {
  if (isEditing.value) {
    const editorValue = getEditorValue("codeEditBox");
    if (!editorValue) {
      return;
    }
    if (fileInfo.originData !== editorValue.value) {
      await fsUtils.writeFile(fileInfo.savePath, editorValue.value);
      fileInfo.originData = editorValue.value;
    }
  }
  const allWindow = getAll();
  for (let i = 0; i < allWindow.length; i++) {
    const w = allWindow[i];
    if (w.label !== "main") {
      try{
        await w.close();
      }catch{}
    }
  }
  await appWindow.close();
};

const { isDark } = useAppTheme();
const isFullScreen = ref(false);
const titleBarColor = computed(() => {
  return isDark.value ? "#272727" : "#f6f6f6";
});
const version = ref("获取版本失败");
getVersion().then((res) => {
  version.value = res;
});
const appGSStore = useAppGlobalSettings();
const { appVersionInfo, goAppUpdate } = useAppVersionInfo();
const openDownloadDialog = async () => {
  await goAppUpdate(true);
  appVersionInfo.value.openDialog = true;
};
const showSetupBtn = computed(() => {
  return (
    version.value !== "获取版本失败" && version.value !== appGSStore.app.latestVersion
  );
});

const showApiTestSearch = computed(() => {
  return info.showContentType === "apiTest" && windowInnerWidth.value >= 820;
});
const searchPosition = computed(() => {
  if (showApiTestSearch.value || info.showContentType !== "apiTest") {
    return "relative";
  } else {
    return "absolute";
  }
});
const resizeHandle = async () => {
  if (await appWindow.isMaximized()) {
    isFullScreen.value = true;
  } else {
    isFullScreen.value = false;
  }
};
let unListen: any;
onMounted(async () => {
  window.addEventListener("resize", resizeHandle);
  unListen = await listen("tauri://focus", (e: any) => {
    if (clickMinimize.value && e.windowLabel === getCurrent().label) {
      clickMinimize.value = false;
      // needSyncLastData.value = true;
      //解决在编辑器最小化时编辑器被销毁导致当前编辑器内容丢失的问题，
      //  此问题之前存在，但现在最小化时不会销毁编辑器，所以不需要处理
      goLastPath();
    }
  });
});
onUnmounted(() => {
  window.removeEventListener("resize", resizeHandle);
  if (unListen) {
    unListen();
  }
});
</script>
<style lang="scss" scoped>
.titlebar {
  height: v-bind(titleBarHeight);
  background: v-bind(titleBarColor);
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 1px;
  left: 1px;
  right: 1px;
  box-sizing: border-box;
  z-index: 100;
  overflow: hidden;
  border-radius: 10px 10px 0 0;
  padding-left: 10px;
  padding-right: 5px;

  .btn-content {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;
  }

  .text {
    color: var(--el-text-color-primary);
    // margin-left: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .api-test-bar {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .search-ipt {
      width: 500px;
      position: v-bind(searchPosition);
    }

    .output-btn {
      margin-left: 5px;
      position: v-bind(searchPosition);
    }
  }

  .btn,
  .btn-content {
    .titlebar-button {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      cursor: pointer;

      &.setup-btn {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background-color: var(--el-color-primary);
        color: #fff;
        margin-right: 10px;

        &:hover {
          background-color: rgb(3, 211, 89);
        }
      }

      &.warning-btn {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        color: #fff;
        margin-right: 10px;
        background-color: rgb(219, 35, 25);
        &:hover {
          background-color: rgb(255, 13, 0);
        }
      }

      &:hover {
        background: var(--el-color-primary-light-7);
      }

      &.danger {
        &:hover {
          background: rgb(255, 45, 34);
        }
      }
    }
  }
}
</style>
