<script setup lang="ts">
import { useRouter } from "vue-router";
import { topRoutes, bottomRoutes } from "./router/routers";
import { storeToRefs } from "pinia";
import { appWindow } from "@tauri-apps/api/window";
import { register, unregister } from "@tauri-apps/api/globalShortcut";
const { registerAllInvokeApi } = useCore();
const { isMainWindow, menuKey } = useAppLayout();
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
onMounted(async () => {
  try {
    shortcutsStore.init();
    if (appWindow.label === "main") {
      const showMainWindowShortcuts =
        shortcutsStore.getShortcuts("强制显示主窗口");
      await unregister(showMainWindowShortcuts);
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
  libUtil.batchUpdateDep();
});
</script>
<template>
  <div class="app">
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
  width: 100%;
  height: 100%;
  background: v-bind(appBackground);
  border-radius: v-bind(borderRadius);
  opacity: v-bind(appOpacity);
  overflow: hidden;
  border: v-bind(borderColor) 1px solid;
  box-sizing: border-box;
  transition: all 1s;
  transform: v-bind(appTransform);
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
