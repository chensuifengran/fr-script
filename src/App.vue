<script setup lang="ts">
import { Expand, Fold } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { topRoutes, bottomRoutes } from "./router/routers";
import { storeToRefs } from "pinia";
const appGSStore = useAppGlobalSettings();
const { app } = storeToRefs(appGSStore);
const router = useRouter();
const menuKey = ref(1);
provide("menuKey", menuKey);

const handleSelect = (index: string) => {
  app.value.state.aside.currentItem = index;
  router.push({
    name: index,
  });
};
const hasFloatWindow = ref(false);
const aside_width = ref("");
const transition = computed(() => {
  if (aside_width.value === "0") {
    return "";
  } else {
    return "all 1s";
  }
});
const asideDisplay = ref("none");
onMounted(async () => {
  asideDisplay.value = "block";
  //自动保存当前全局配置以及导入之前的全局配置
  await appGSStore.init();
  handleSelect(app.value.state.aside.currentItem);
});
const isDark = useDark({});
provide("isDark", isDark);
const appAsideBgColor = computed(() => {
  return isDark.value ? "#272727" : "#f6f6f6";
});
provide("appAsideBgColor", appAsideBgColor);
const appBackground = computed(() => {
  return isDark.value ? "#000" : "#fff";
});
provide("appBackground", appBackground);
</script>

<template>
  <div class="app" id="app">
    <TitleBar />
    <div class="common-layout" v-show="!hasFloatWindow">
      <el-container>
        <el-aside class="aside">
          <el-tooltip
            effect="dark"
            :content="app.state.aside.collapsed ? '展开' : '折叠'"
            placement="right"
          >
            <el-button
              class="aside-btn"
              :icon="app.state.aside.collapsed ? Expand : Fold"
              text
              @click="app.state.aside.collapsed = !app.state.aside.collapsed"
            />
          </el-tooltip>
          <el-menu
            :collapse="app.state.aside.collapsed"
            :collapse-transition="false"
            popper-effect="dark"
            class="el-menu-vertical"
            :default-active="app.state.aside.currentItem"
            :key="menuKey"
            @select="handleSelect"
          >
            <div>
              <el-menu-item
                v-for="topRoute in topRoutes"
                :index="topRoute.name"
                :key="topRoute.path + '|' + topRoute.meta!.title"
              >
                <el-icon>
                  <component :is="topRoute.meta!.icon" />
                </el-icon>
                <template #title>{{ topRoute.meta!.title }}</template>
              </el-menu-item>
            </div>
            <div data-tauri-drag-region style="flex: 1"></div>
            <div>
              <el-menu-item
                v-for="bottomRoute in bottomRoutes"
                :index="bottomRoute.name"
                :key="bottomRoute.path+ '|' + bottomRoute.meta!.title"
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
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<style scoped lang="scss">
#app {
  background: v-bind(appBackground);
}
.common-layout {
  width: 100%;
  top: 30px;
  height: calc(100% - 30px);
  position: relative;

  .aside {
    transition: v-bind(transition);
    overflow-x: hidden;
    width: v-bind(aside_width);
    display: v-bind(asideDisplay);
    position: relative;
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
.app {
  .common-layout {
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
