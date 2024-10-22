<template>
  <!-- 退出提醒弹窗 -->
  <el-dialog v-model="showQuitDialog" title="退出程序">
    <div>确定要退出程序吗?</div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showQuitDialog = false">取消</el-button>
        <el-button type="danger" @click="closeHandle"
          >{{ isEditing ? "保存并" : "" }}退出</el-button
        >
      </span>
    </template>
  </el-dialog>
  <transition
    enter-active-class="animate__animated animate__fadeInUp"
    leave-active-class="animate__animated animate__fadeOutDown"
  >
    <div
      data-tauri-drag-region
      class="titlebar"
      v-if="!isEditing"
      style="cursor: move"
    >
      <div class="title" data-tauri-drag-region style="cursor: move">
        <div class="text">
          <el-image style="width: 20px; height: 20px" :src="icon" />
          <el-text>{{ info.title }}</el-text>
          <div
            v-if="controlDeviceInfo.id.length"
            ml-4
            justify-center
            flex
            flex-row
            items-center
          >
            <el-text>正在被</el-text>
            <el-tag type="warning">{{ controlDeviceInfo.id }}</el-tag>
            <el-text>控制</el-text>
          </div>
        </div>
        <transition
          enter-active-class="animate__animated animate__fadeInUp"
          leave-active-class="animate__animated animate__fadeOutDown"
        >
          <div
            class="api-test-bar"
            data-tauri-drag-region
            v-if="showApiTestSearch"
            style="cursor: move"
          >
            <el-input
              class="search-ipt"
              v-model="info.apiTest.searchValue"
              clearable
              placeholder="可输入API的关键字对API进行筛选"
            />
            <el-button
              class="output-btn"
              @click="info.apiTest.openOutput = true"
              circle
              ><el-icon>
                <span i-mdi-square-rounded-badge-outline></span> </el-icon
            ></el-button>
          </div>
          <div
            v-else
            data-tauri-drag-region
            flex
            flex-1
            flex-row
            items-center
            justify-center
          >
            <el-input
              v-if="
                searchInfo.show && searchInfo.target === SearchTarget.ScriptList
              "
              class="search-ipt"
              v-model="searchInfo.content"
              clearable
              placeholder="搜索脚本名称或备注"
            />
            <el-input
              v-if="
                searchInfo.show &&
                searchInfo.target === SearchTarget.CodeSnippetList
              "
              class="search-ipt"
              v-model="searchInfo.content"
              clearable
              placeholder="搜索代码片段:名称、备注、前缀"
            />
          </div>
        </transition>
      </div>
      <div class="btn">
        <el-tooltip
          effect="light"
          content="基础功能不可用，点我安装依赖"
          placement="bottom"
          v-if="appGSStore.app.dependenceState === '不可用'"
        >
          <div class="titlebar-button warning-btn" @click="goInstallDeps()">
            <el-icon>
              <span i-mdi-tools></span>
            </el-icon>
          </div>
        </el-tooltip>
        <el-tooltip
          effect="light"
          content="有新版本，点我更新"
          placement="bottom"
          v-if="showSetupBtn && appGSStore.view.showUpdateInTitleBar"
        >
          <div class="titlebar-button setup-btn" @click="openDownloadDialog">
            <el-icon>
              <span i-mdi-cloud-download-outline></span>
            </el-icon>
          </div>
        </el-tooltip>
        <el-button
          link
          class="titlebar-button"
          @click="!isEditing && showTour()"
        >
          <el-icon><span i-mdi-lightbulb-question-outline /></el-icon>
        </el-button>
        <el-button
          link
          class="titlebar-button"
          @click="!isEditing && toggleMostTop()"
        >
          <el-icon>
            <span
              i-solar-pin-bold-duotone
              :style="{
                color: mostTop
                  ? 'var(--el-color-primary-dark-2)'
                  : 'var(--color)',
              }"
            ></span>
          </el-icon>
        </el-button>
        <el-button
          link
          class="titlebar-button"
          @click="!isEditing && minHandle()"
        >
          <el-icon>
            <span i-mdi-minus></span>
          </el-icon>
        </el-button>
        <el-button
          link
          class="titlebar-button"
          @click="!isEditing && maxHandle()"
        >
          <el-icon>
            <span v-if="!isFullScreen" i-mdi-fullscreen></span>
            <span v-else i-mdi-fullscreen-exit></span>
          </el-icon>
        </el-button>
        <el-button
          link
          class="titlebar-button danger"
          @click="!isEditing && (showQuitDialog = true)"
        >
          <el-icon>
            <span i-mdi-window-close></span>
          </el-icon>
        </el-button>
      </div>
    </div>
    <div class="titlebar" data-tauri-drag-region v-else-if="isEditing">
      <EditorHeader>
        <div class="btn-content">
          <el-button
            link
            class="titlebar-button"
            @click="isEditing && showTour()"
          >
            <el-icon><span i-mdi-lightbulb-question-outline /></el-icon>
          </el-button>
          <el-button
            link
            class="titlebar-button"
            @click="isEditing && toggleMostTop()"
          >
            <el-icon
              ><span
                i-solar-pin-bold-duotone
                :style="{
                  color: mostTop
                    ? 'var(--el-color-primary-dark-2)'
                    : 'var(--color)',
                }"
            /></el-icon>
          </el-button>
          <el-button
            link
            class="titlebar-button"
            @click="isEditing && minHandle()"
          >
            <el-icon>
              <span i-mdi-minus></span>
            </el-icon>
          </el-button>
          <el-button
            link
            class="titlebar-button"
            @click="isEditing && maxHandle()"
          >
            <el-icon>
              <span v-if="!isFullScreen" i-mdi-fullscreen></span>
              <span v-else i-mdi-fullscreen-exit></span>
            </el-icon>
          </el-button>
          <el-button
            link
            class="titlebar-button danger"
            @click="isEditing && (showQuitDialog = true)"
          >
            <el-icon>
              <span i-mdi-window-close></span>
            </el-icon>
          </el-button>
        </div>
      </EditorHeader>
    </div>
  </transition>
</template>
<script lang="ts" setup>
import {
  getCurrentWebviewWindow,
  getAllWebviewWindows,
} from "@tauri-apps/api/webviewWindow";
import icon from "../assets/icon64x64.png";
import { getVersion } from "@tauri-apps/api/app";
import { listen } from "@tauri-apps/api/event";
import { SearchTarget } from "../hooks/useAutoTitleBar";
const { info, searchInfo, windowInnerWidth, clickMinimize } = useAutoTitleBar();
const { goInstallDeps } = useDepInfo();
const { controlDeviceInfo } = useControl();
const { isEditing, fileInfo } = useScriptInfo();
const { getEditorValue } = useEditor();
const { showTour } = useTour();
const mostTop = ref(false);
const toggleMostTop = () => {
  mostTop.value = !mostTop.value;
  if (IS_PLAYGROUND_ENV) {
    return;
  }
  const appWindow = getCurrentWebviewWindow();
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
  if (IS_PLAYGROUND_ENV) {
    return;
  }
  const appWindow = getCurrentWebviewWindow();
  appWindow.minimize();
};
const maxHandle = async () => {
  if (IS_PLAYGROUND_ENV) {
    const { unmaximizeSize, maximizeSize } = useAppLayout();
    if (isFullScreen.value) {
      unmaximizeSize();
    } else {
      maximizeSize();
    }
    isFullScreen.value = !isFullScreen.value;
    return;
  }
  const appWindow = getCurrentWebviewWindow();
  if (await appWindow.isMaximized()) {
    appWindow.unmaximize();
    isFullScreen.value = false;
  } else {
    isFullScreen.value = true;
    appWindow.maximize();
  }
};
const closeHandle = async () => {
  if (IS_PLAYGROUND_ENV) {
    return;
  }
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
  const allWindow = await getAllWebviewWindows();
  for (let i = 0; i < allWindow.length; i++) {
    const w = allWindow[i];
    if (w.label !== "main") {
      try {
        await w.close();
      } catch {}
    }
  }
  const appWindow = getCurrentWebviewWindow();
  await appWindow.close();
};

const { isDark } = useAppTheme();
const isFullScreen = ref(false);
const titleBarColor = computed(() => {
  return isDark.value ? "#272727" : "#f6f6f6";
});
const version = ref(IS_PLAYGROUND_ENV ? "playground" : "获取版本失败");
if (!IS_PLAYGROUND_ENV) {
  getVersion().then((res) => {
    version.value = res;
  });
}

const appGSStore = useAppGlobalSettings();
const { appVersionInfo, goAppUpdate } = useAppVersionInfo();
const openDownloadDialog = async () => {
  if (IS_PLAYGROUND_ENV) {
    return;
  }
  await goAppUpdate(true);
  appVersionInfo.value.openDialog = true;
};
const showSetupBtn = computed(() => {
  if (IS_PLAYGROUND_ENV) {
    return false;
  }
  return (
    version.value !== "获取版本失败" &&
    version.value !== appGSStore.app.latestVersion
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
  if (IS_PLAYGROUND_ENV) {
    return;
  }
  const appWindow = getCurrentWebviewWindow();
  if (await appWindow.isMaximized()) {
    isFullScreen.value = true;
  } else {
    isFullScreen.value = false;
  }
};
let unListen: any;
onMounted(async () => {
  if (IS_PLAYGROUND_ENV) {
    return;
  }
  window.addEventListener("resize", resizeHandle);
  unListen = await listen("tauri://focus", (e: any) => {
    if (
      clickMinimize.value &&
      e.windowLabel === getCurrentWebviewWindow().label
    ) {
      clickMinimize.value = false;
      goLastPath();
    }
  });
});
onUnmounted(() => {
  if (IS_PLAYGROUND_ENV) {
    return;
  }
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
  position: absolute;
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

    .output-btn {
      margin-left: 5px;
      position: v-bind(searchPosition);
    }
  }
  .search-ipt {
    width: 500px;
    position: v-bind(searchPosition);
  }

  .btn,
  .btn-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    .titlebar-button {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 35px;
      height: 35px;
      cursor: pointer;
      border-radius: 0;
      margin: 0;

      &.setup-btn {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background-color: var(--el-color-primary);
        color: var(--el-bg-color);
        margin-right: 10px;
      }
      &.warning-btn {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        color: var(--el-bg-color);
        margin-right: 10px;
        background-color: var(--el-color-danger);
      }
      &.danger {
        color: var(--el-color-danger);
        &:hover {
          background-color: var(--el-color-danger);
        }
      }
      &:hover {
        color: var(--el-text-color-primary);
        background-color: var(--el-color-primary-light-7);
      }
    }
  }
}
</style>
