<script setup lang="ts">
import { useRouter } from "vue-router";
import { topRoutes, bottomRoutes } from "./router/routers";
import { storeToRefs } from "pinia";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import {
  isRegistered,
  register,
  unregister,
} from "@tauri-apps/plugin-global-shortcut";
import { PhysicalPosition, PhysicalSize } from "@tauri-apps/api/dpi";

const { registerAllInvokeApi } = useCore();
const { isMainWindow, menuKey, appResizeElementClass } = useAppLayout();
const appGSStore = useAppGlobalSettings();
const listStore = useListStore();
const shortcutsStore = useGlobalShortcutsStore();
const { app } = storeToRefs(appGSStore);
const router = useRouter();
const {
  borderRadius,
  appOpacity,
  borderColor,
  appTransform,
  appAsideBgColor,
  appBackground,
} = useAppTheme();
const { isEditing } = useScriptInfo();
const contentHeight = computed(() => {
  if (isEditing.value) {
    return "calc(100% - 35px)";
  } else {
    return "calc(100% - 40px)";
  }
});
const contentTop = computed(() => {
  if (isEditing.value) {
    return "35px";
  } else {
    return "40px";
  }
});
const { info, syncWindowInnerWidth } = useAutoTitleBar();
const { contentTransform, asideBarPos } = useScriptInfo();
const handleSelect = (index: string, menuClick = false) => {
  if (index === "setting") {
    libUtil.checkDepUpdate();
  }
  app.value.state.aside.currentItem = index;
  if (index === "script") {
    if (menuClick) {
      index = "scriptList";
    } else {
      index = (router.currentRoute.value.name as string) || "scriptList";
    }
  }
  router.replace({
    name: index,
  });
  info.showContentType = index;
  setTimeout(() => {
    if (app.value.state.aside.collapsed) {
      //获取当前路由的meta
      const meta = router.currentRoute.value.meta;
      info.title = meta.title as string;
    } else {
      info.title = "风染脚本";
    }
  }, 200);
};
const aside_width = computed(() => {
  if (app.value.state.aside.collapsed) {
    return "40px";
  } else {
    return "97px";
  }
});
const init = async (listenResize = true) => {
  listenResize &&
    window.addEventListener("resize", () => {
      syncWindowInnerWidth(window.innerWidth);
      if (window.innerWidth < 800 && !app.value.state.aside.collapsed) {
        collapsedAside();
      } else if (window.innerWidth >= 800 && app.value.state.aside.collapsed) {
        collapsedAside();
      }
    });
  //自动保存当前全局配置以及导入之前的全局配置
  await appGSStore.init();
  await listStore.init();
  handleSelect(app.value.state.aside.currentItem);
  libUtil.checkDepUpdate();
};
const startInfo = {
  size: [0, 0],
  pos: [0, 0],
};
const showResizeDiv = ref(false);
onMounted(async () => {
  initInjectConstantType();
  if (IS_PLAYGROUND_ENV) {
    //playground环境
    init();
    await registerAllInvokeApi();
    return;
  }
  try {
    const appWindow = getCurrentWebviewWindow();
    shortcutsStore.init();
    if (appWindow.label === "main") {
      showResizeDiv.value = true;
      const size = await appWindow.innerSize();
      const pos = await appWindow.innerPosition();
      startInfo.size = [size.width, size.height];
      startInfo.pos = [pos.x, pos.y];
      const showMainWindowShortcuts =
        shortcutsStore.getShortcuts("强制显示主窗口");
      if (await isRegistered(showMainWindowShortcuts)) {
        await unregister(showMainWindowShortcuts);
      }
      register(showMainWindowShortcuts, () => appWindow.show());
    }
    const currentWindowLabel = appWindow.label;
    if (currentWindowLabel !== "main") {
      const notInitWindows = ["floatWindow", "pointerUtil", "notification"];
      if (!notInitWindows.includes(currentWindowLabel)) {
        await init(false);
      }
      router.replace({
        path: "/" + currentWindowLabel,
      });
      isMainWindow.value = false;
    } else {
      await init();
    }
    await registerAllInvokeApi();
  } catch (error) {
    console.error("初始化异常：", error);
  }
  if (process.env.NODE_ENV === "production") {
    window.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
  }
});
onUnmounted(() => {
  if (IS_PLAYGROUND_ENV) {
    //playground环境
    return;
  }
  const appWindow = getCurrentWebviewWindow();
  if (appWindow.label === "main") {
    const showMainWindowShortcuts =
      shortcutsStore.getShortcuts("强制显示主窗口");
    unregister(showMainWindowShortcuts);
  }
});

const collapsedAside = () => {
  app.value.state.aside.collapsed = !app.value.state.aside.collapsed;
  handleSelect(app.value.state.aside.currentItem);
};
const { appVersionInfo, goDownloadNewApp } = useAppVersionInfo();
onBeforeMount(() => {
  if (IS_PLAYGROUND_ENV) {
    return;
  }
  libUtil.batchUpdateDep();
});
const { appWidth, appHeight } = useAppLayout();
const allDragClass = ["app-resize-bar", "app-resize-point"];
const showGhost = ref(false);
const handleDragstart = (event: DragEvent) => {
  if (
    event.target &&
    allDragClass.includes((event.target as HTMLElement).className.split(" ")[0])
  ) {
    showGhost.value = true;
    const curWindow = getCurrentWebviewWindow();
    if (curWindow) {
      curWindow.innerPosition().then((pos) => {
        startInfo.pos = [pos.x, pos.y];
      });
      curWindow.innerSize().then((size) => {
        startInfo.size = [size.width, size.height];
      });
    }
  }
};
const handleDragend = (event: DragEvent) => {
  if (
    event.target &&
    allDragClass.includes((event.target as HTMLElement).className.split(" ")[0])
  ) {
    const curWindow = getCurrentWebviewWindow();
    if (curWindow) {
      const direction = (event.target as HTMLElement).className.split(" ")[1];
      const newInfo = {
        size: [...startInfo.size],
        pos: [...startInfo.pos],
      };
      const { offsetY, offsetX } = event;
      if (direction === "top") {
        const newHeight = startInfo.size[1] - offsetY;
        const newY = startInfo.pos[1] + offsetY;
        if (newHeight !== startInfo.size[1]) {
          newInfo.size = [startInfo.size[0], newHeight];
          newInfo.pos = [startInfo.pos[0], newY];
        }
      } else if (direction === "bottom") {
        const newHeight = startInfo.size[1] + offsetY;
        if (newHeight !== startInfo.size[1]) {
          newInfo.size = [startInfo.size[0], newHeight];
        }
      } else if (direction === "left") {
        const newWidth = startInfo.size[0] - offsetX;
        const newX = startInfo.pos[0] + offsetX;
        if (newWidth !== startInfo.size[0]) {
          newInfo.size = [newWidth, startInfo.size[1]];
          newInfo.pos = [newX, startInfo.pos[1]];
        }
      } else if (direction === "right") {
        const newWidth = startInfo.size[0] + offsetX;
        if (newWidth !== startInfo.size[0]) {
          newInfo.size = [newWidth, startInfo.size[1]];
        }
      } else if (direction === "lt") {
        const newHeight = startInfo.size[1] - offsetY;
        const newY = startInfo.pos[1] + offsetY;
        const newWidth = startInfo.size[0] - offsetX;
        const newX = startInfo.pos[0] + offsetX;
        newInfo.size = [newWidth, newHeight];
        newInfo.pos = [newX, newY];
      } else if (direction === "rt") {
        const newHeight = startInfo.size[1] - offsetY;
        const newWidth = startInfo.size[0] + offsetX;
        const newY = startInfo.pos[1] + offsetY;
        newInfo.size = [newWidth, newHeight];
        newInfo.pos = [startInfo.pos[0], newY];
      } else if (direction === "lb") {
        const newWidth = startInfo.size[0] - offsetX;
        const newX = startInfo.pos[0] + offsetX;
        const newHeight = startInfo.size[1] + offsetY;
        newInfo.size = [newWidth, newHeight];
        newInfo.pos = [newX, startInfo.pos[1]];
      } else if (direction === "rb") {
        const newWidth = startInfo.size[0] + offsetX;
        const newHeight = startInfo.size[1] + offsetY;
        newInfo.size = [newWidth, newHeight];
      }

      if (startInfo.size.join(",") !== newInfo.size.join(",")) {
        curWindow.setSize(new PhysicalSize(newInfo.size[0], newInfo.size[1]));
        startInfo.size = newInfo.size;
      }
      if (startInfo.pos.join(",") !== newInfo.pos.join(",")) {
        curWindow.setPosition(
          new PhysicalPosition(newInfo.pos[0], newInfo.pos[1])
        );
        startInfo.pos = newInfo.pos;
      }

      curWindow.setFocus();
    }
    showGhost.value = false;
  }
};
</script>
<template>
  <div class="app" @dragstart="handleDragstart" @dragend="handleDragend">
    <template v-if="showResizeDiv">
      <div
        class="app-resize-bar"
        draggable="true"
        v-for="bar in appResizeElementClass.bar"
        :class="bar"
        :key="bar"
      ></div>
      <div
        class="app-resize-point"
        draggable="true"
        v-for="point in appResizeElementClass.point"
        :class="point"
        :key="point"
      ></div>
    </template>
    <tours />
    <FillApiParamDialog />
    <code-snippet-save-dialog />
    <template v-if="isMainWindow">
      <AutoTitleBar />
      <div class="common-layout">
        <el-container>
          <el-aside class="aside">
            <el-tooltip
              effect="dark"
              :content="app.state.aside.collapsed ? '展开' : '折叠'"
              placement="right"
            >
              <template v-if="app.state.aside.collapsed">
                <el-button
                  class="aside-btn"
                  link
                  type="primary"
                  @click="collapsedAside"
                >
                  <el-icon>
                    <span i-solar-alt-arrow-right-linear></span>
                  </el-icon>
                </el-button>
              </template>
              <template v-else>
                <el-button
                  class="aside-btn"
                  link
                  type="primary"
                  @click="collapsedAside"
                >
                  <el-icon>
                    <span i-solar-alt-arrow-left-linear></span>
                  </el-icon>
                </el-button>
              </template>
            </el-tooltip>
            <el-menu
              :collapse="app.state.aside.collapsed"
              :collapse-transition="false"
              popper-effect="dark"
              class="el-menu-vertical"
              :default-active="app.state.aside.currentItem"
              :key="menuKey"
              @select="(index: string) => handleSelect(index, true)"
            >
              <div>
                <el-menu-item
                  v-for="topRoute in topRoutes"
                  :index="topRoute.name as string"
                  :key="topRoute.path + '|' + topRoute.meta!.title"
                  :id="topRoute.meta?.id"
                >
                  <el-icon>
                    <component :is="topRoute.meta!.icon" />
                  </el-icon>
                  <template #title>{{ topRoute.meta!.title }}</template>
                </el-menu-item>
              </div>
              <div data-tauri-drag-region style="flex: 1; cursor: move"></div>
              <div>
                <el-menu-item
                  v-for="bottomRoute in bottomRoutes"
                  :index="bottomRoute.name as string"
                  :key="bottomRoute.path + '|' + bottomRoute.meta!.title"
                  :id="bottomRoute.meta?.id"
                >
                  <el-icon>
                    <component :is="bottomRoute.meta!.icon" />
                  </el-icon>
                  <template #title>{{ bottomRoute.meta!.title }}</template>
                </el-menu-item>
              </div>
            </el-menu>
          </el-aside>
          <el-main class="app-main">
            <router-view v-slot="{ Component }">
              <transition
                enter-active-class="animate__animated animate__fadeIn "
              >
                <component :is="Component" />
              </transition>
            </router-view>
          </el-main>
        </el-container>
      </div>
      <el-dialog
        v-model="appVersionInfo.openDialog"
        :title="'版本更新v' + appVersionInfo.version"
        class="version-update-dialog"
      >
        <div>{{ appVersionInfo.desc }}</div>
        <template #footer>
          <div>
            <el-button
              type="info"
              size="small"
              @click="appVersionInfo.openDialog = false"
              >取消</el-button
            >
            <el-button
              size="small"
              v-for="item in appVersionInfo.downloadUrl"
              :key="item.origin"
              type="primary"
              @click="goDownloadNewApp(item)"
              >{{ item.origin }}下载</el-button
            >
          </div>
        </template>
      </el-dialog>
    </template>
    <template v-else>
      <router-view v-slot="{ Component }">
        <transition enter-active-class="animate__animated animate__fadeIn ">
          <component :is="Component" />
        </transition>
      </router-view>
    </template>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dialog__footer) {
  padding-top: 5px;
}

.app {
  width: v-bind(appWidth);
  height: v-bind(appHeight);
  position: relative;
  background: v-bind(appBackground);
  border-radius: v-bind(borderRadius);
  opacity: v-bind(appOpacity);
  overflow: hidden;
  border: v-bind(borderColor) 1px solid;
  box-sizing: border-box;
  transition: all 1s;
  transform: v-bind(appTransform);
  .app-resize-bar {
    position: absolute;
    background-color: var(--el-color-primary);
    opacity: 0;
    z-index: 99998;
    border-radius: v-bind(borderRadius);
    transition: all 0.5s;
    // 上边
    &:nth-child(1) {
      top: -1px;
      left: 0;
      right: 0;
      height: 4px;
      cursor: n-resize;
    }
    // 下边
    &:nth-child(2) {
      bottom: -1px;
      left: 0;
      right: 0;
      height: 4px;
      cursor: s-resize;
    }
    // 左边
    &:nth-child(3) {
      top: 0;
      left: -1px;
      bottom: 0;
      width: 4px;
      cursor: w-resize;
    }
    // 右边
    &:nth-child(4) {
      top: 0;
      right: -1px;
      bottom: 0;
      width: 4px;
      cursor: e-resize;
    }
    &:hover {
      opacity: 1;
    }
  }
  .app-resize-point {
    width: 4px;
    height: 4px;
    position: absolute;
    z-index: 99999;
    opacity: 0;
    &:hover {
      opacity: 1;
    }
    // 左上
    &:nth-child(5) {
      top: 1px;
      left: 1px;
      border-top: var(--el-color-primary) 4px solid;
      border-left: var(--el-color-primary) 4px solid;
      cursor: nw-resize;
    }
    // 右上
    &:nth-child(6) {
      top: 1px;
      right: 1px;
      border-right: var(--el-color-primary) 4px solid;
      border-top: var(--el-color-primary) 4px solid;
      cursor: ne-resize;
    }
    // 左下
    &:nth-child(7) {
      bottom: 1px;
      left: 1px;
      border-bottom: var(--el-color-primary) 4px solid;
      border-left: var(--el-color-primary) 4px solid;
      cursor: sw-resize;
    }
    // 右下
    &:nth-child(8) {
      bottom: 1px;
      right: 1px;
      border-right: var(--el-color-primary) 4px solid;
      border-bottom: var(--el-color-primary) 4px solid;
      cursor: se-resize;
    }
  }
}

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

.common-layout {
  width: 100%;
  top: v-bind(contentTop);
  height: v-bind(contentHeight);
  position: relative;
  overflow: hidden;

  .title-tag {
    margin-left: 10px;
  }

  .aside {
    transition: all 1s;
    overflow-x: hidden;
    width: v-bind(aside_width);
    position: v-bind(asideBarPos);
    transform: v-bind(contentTransform);

    &:hover {
      .aside-btn {
        display: block;
      }
    }

    .aside-btn {
      position: absolute;
      width: 30px;
      height: 30px;
      top: calc(50% - 20px);
      right: 0;
      display: none;
      z-index: 999;
    }
  }

  .el-menu-vertical {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .app-main {
    width: 100%;
    height: 100%;
    position: relative;
    padding: 0;
    overflow: hidden;
    background: v-bind(appAsideBgColor);
  }
}
</style>
<style lang="scss">
::-webkit-scrollbar-thumb {
  background-color: var(--el-color-primary);
  border-radius: 6px;
}

.app {
  .version-update-dialog {
    .el-dialog__body {
      padding: 10px;
    }
  }

  .common-layout {
    .el-overlay {
      border-radius: 10px;
      overflow: hidden;
    }

    .el-container {
      width: 100%;
      height: 100%;
      position: relative;

      .aside {
        .el-menu-vertical {
          background: v-bind(appAsideBgColor);
          border-right: 0;

          .el-menu-item {
            .el-menu-tooltip__trigger {
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;

              .el-icon {
                margin-right: 0;
              }
            }

            &.is-active {
              position: relative;

              &::before {
                content: "";
                position: absolute;
                top: 20%;
                right: 0;
                width: 5px;
                height: 60%;
                background: var(--el-color-primary-light-3);
                border-radius: 3px 0 0px 3px;
                animation: forwards aside-width 0.5s;
              }
            }
          }
        }
      }
    }
  }
}

//高度从0到60%，top从50%到20%的动画
@keyframes aside-width {
  0% {
    height: 0;
    top: 50%;
  }

  100% {
    height: 60%;
    top: 20%;
  }
}
</style>
