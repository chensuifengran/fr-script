<template>
  <div class="remd">
    <ATHeader class="alone-page-header" v-if="!isMainWindow" :openOutput="() => (info.apiTest.openOutput = true)"
      :changeSearchValue="(value) => (info.apiTest.searchValue = value)" />
    <div class="page-content" ref="pageContentRef" v-infinite-scroll="load" :infinite-scroll-distance="40"
      :infinite-scroll-immediate="false">
      <transition enter-active-class="animate__animated animate__fadeInDown"
        leave-active-class="animate__animated animate__fadeOutUp">
        <div class="api-test-bar" data-tauri-drag-region style="cursor: move" v-if="showApiTestSearch && isMainWindow">
          <el-input class="search-ipt" v-model="info.apiTest.searchValue" clearable placeholder="可输入API的关键字对API进行筛选">
          </el-input>
          <el-button class="output-btn" @click="info.apiTest.openOutput = true"><el-icon>
              <span i-solar-notification-unread-linear></span>
            </el-icon></el-button>
        </div>
      </transition>
      <VueDraggable ref="el" v-model="allDocumentItems" :animation="200" ghostClass="ghost" class="draggable-content"
        handle=".drag-handle" :disabled="disableSort" @update="onUpdate" @start="onStart">
        <ApiDocumentItem v-for="m in allDocumentItems" :key="m?.dialog?.targetMethodName || m?.dialog?.title"
          :model="m!" :show-hover="showItemHover" />
      </VueDraggable>

      <el-empty v-if="!allDocumentItems.length" description="没有找到相应的API"></el-empty>
      <div class="end" v-if="isEnd">
        ------到底了，共{{ allDocumentItems.length }}个API------
      </div>
      <div class="loading-box" v-show="mainLoading">
        <Loading />加载中...
      </div>
    </div>
    <el-drawer v-model="info.apiTest.openOutput" title="" direction="btt" :size="app.modulesSetting.drawerSize"
      class="drawer-output">
      <template #header="{ titleId, titleClass }">
        <h4 :id="titleId" :class="titleClass">API测试-输出结果</h4>
        <el-select v-model="app.modulesSetting.drawerSize" placeholder="大小" size="small" class="options select">
          <el-option v-for="n in 8" :key="n" :label="20 + n * 10 + '%'" :value="20 + n * 10 + '%'" />
        </el-select>
        <el-switch class="options" v-model="app.modulesSetting.autoOpenOutput" inline-prompt
          style="--el-switch-on-color: #00843b; --el-switch-off-color: #ccc" active-text="自动显示" inactive-text="手动显示" />
        <el-button class="options" size="small" @click="clearOutput">
          <el-icon>
            <span i-mdi-playlist-remove></span>
          </el-icon>清空输出
        </el-button>
      </template>
      <el-scrollbar v-if="output.length" class="output">
        <div v-for="text in output" :key="text" class="output-text">
          <el-text size="small">{{ text }}</el-text>
        </div>
      </el-scrollbar>
      <div v-else class="empty-show">
        <el-empty description="暂无输出" :image-size="emptyImgSize" style="margin-top: -40px"></el-empty>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import { SortableEvent, VueDraggable } from "vue-draggable-plus";
import Loading from "../components/Loading.vue";
import { storeToRefs } from "pinia";
const showItemHover = ref(true);
const pageContentRef = ref<HTMLElement>();
const { builtInApiTestModules, moveBuiltInApiIndex, setTestModuleCtx } = useCore();
const { info, windowInnerWidth } = useAutoTitleBar();
const appGSStore = useAppGlobalSettings();
const { app } = storeToRefs(appGSStore);
const mainLoading = ref(true);
const isEnd = ref(false);
const { isMainWindow } = useAppLayout();
const { appBackground } = useAppTheme();
const pagePadding = ref("10px");
const antiShakeValue = ref("");
const disableSort = computed(() => {
  return antiShakeValue.value !== ''
})
const onStart = () => {
  showItemHover.value = false;
};
const onEnd = () => {
  showItemHover.value = true;
}
const onUpdate = (e: SortableEvent) => {
  const { oldIndex, newIndex } = e;
  if (oldIndex !== undefined && newIndex !== undefined) {
    moveBuiltInApiIndex(oldIndex, newIndex);
  }
  onEnd();
}
const output = ref<string[]>([]);
const clearOutput = () => {
  output.value = [];
};
const showApiTestSearch = computed(() => {
  return info.showContentType === "apiTest" && windowInnerWidth.value < 820;
});
const emptyImgSize = computed(() => {
  const size = app.value.modulesSetting.drawerSize.replace("%", "");
  return +size * 3 - 40;
});

let timer: any = null;
watchEffect(() => {
  const value = info.apiTest.searchValue;
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    if (antiShakeValue.value === value) {
      return;
    }
    antiShakeValue.value = value;
  }, 500);
});

const loadCount = ref(0);
let tatalCount = 0;
onMounted(() => {
  const pageContent = pageContentRef.value!;
  loadCount.value = Math.ceil(pageContent.offsetHeight / 43) + 1;
  const t = setTimeout(() => {
    mainLoading.value = false;
    clearTimeout(t);
  }, 500);
  if (!appGSStore.isInited) {
    appGSStore.init();
  }
});
const load = async () => {
  if (loadCount.value < tatalCount) {
    loadCount.value = Math.min(loadCount.value + 5, tatalCount);
  } else if (loadCount.value === tatalCount) {
    isEnd.value = true;
  }
};
const allDocumentItems = computed<TestModuleType[]>({
  get: () => {
    const allList = [
      ...builtInApiTestModules.value
        .filter((d) => {
          if (antiShakeValue.value) {
            return (
              d!.dialog.targetMethodName?.includes(antiShakeValue.value) ||
              d!.dialog.title?.includes(antiShakeValue.value) ||
              d!.dialog.content?.includes(antiShakeValue.value) ||
              d!.document!.howToUse?.includes(antiShakeValue.value) ||
              d!.document!.searchKeys?.some((key) => key.includes(antiShakeValue.value))
            );
          }
          return true;
        }) as TestModuleType[],
    ].sort((a, b) => {
      return b!.weight! - a!.weight!;
    });
    tatalCount = allList.length;
    return allList.slice(0, loadCount.value);
  },
  set: (v) => {
    loadCount.value = v.length;
  },
});
onBeforeMount(() => {
  if (!isMainWindow.value) {
    pagePadding.value = "0";
  }
});
const showDetails = (text: string | undefined, preStr = "") => {
  if (app.value.modulesSetting.autoOpenOutput) {
    info.apiTest.openOutput = true;
  }

  //获取时分秒,不足两位补0
  const date = new Date();
  const h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  const s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  const time = `[${h}:${m}:${s}] `;
  output.value.unshift(time + preStr + "：\t" + text);
};

onMounted(() => {
  setTestModuleCtx({ showDetails });
});

</script>

<style lang="scss" scoped>
.empty-show {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.output {
  width: 100%;

  .output-text {
    user-select: text;
  }
}

.options {
  margin-right: 5px;
}

.select {
  width: 100px;
}

.ghost {
  opacity: 0.9;
}

.remd {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: v-bind(pagePadding);
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 10px 10px 10px 0;
  background: v-bind(appBackground);
  position: relative;

  .alone-page-header {
    height: 45px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: v-bind(appBackground);
    color: var(--el-color-primary);
    padding-left: 5px;
  }

  .page-content {
    flex: 1;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 5px;
    position: relative;

    .api-test-bar {
      display: flex;
      flex-direction: row;

      .output-btn {
        margin-left: 5px;
      }
    }

    .loading-box {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: v-bind(appBackground);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .end {
      text-align: center;
      color: #ccc;
      margin-top: 5px;
    }
  }
}
</style>
<style lang="scss">
.el-button-group {
  margin: 5px;
}

.drawer-output {
  .el-drawer__body {
    display: flex;
  }
}
</style>
