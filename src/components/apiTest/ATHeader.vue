<template>
  <div>
    <div data-tauri-drag-region style="width: 25%; cursor: move">
      <span @click="titleClickHandler">调试</span>
    </div>
    <div class="header-r">
      <div data-tauri-drag-region style="cursor: move" class="move"></div>
      <el-input @input="changeSearchValue(searchValue)" class="input" v-model="searchValue" clearable
        placeholder="可输入API的关键字对API进行筛选">
      </el-input>
      <el-button class="circle-btn" type="info" circle @click="openOutput"><el-icon>
          <IEpNotification />
        </el-icon></el-button>
      <el-button class="circle-btn" type="info" circle @click="showApiTestButton"><el-icon>
          <IEpSemiSelect />
        </el-icon></el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAll, getCurrent } from "@tauri-apps/api/window";
import { ElMessageBox } from "element-plus";

const searchValue = ref("");
defineProps({
  openOutput: {
    type: Function as PropType<() => void>,
    required: true,
  },
  changeSearchValue: {
    type: Function as PropType<(value: string) => void>,
    required: true,
  },
});
const showApiTestButton = () => {
  getCurrent().hide();
  const mainWindow = getAll().find((w) => w.label === "main");
  if (mainWindow) {
    mainWindow.setFocus();
  }
};
const { isMainWindow } = useAppLayout();
const { appAsideBgColor, appBackground } = useAppTheme();
let clickCount = 0;
let timer: any;
const titleClickHandler = () => {
  if (++clickCount > 3) {
    ElMessageBox.confirm("是否前往首页", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      isMainWindow && (isMainWindow.value = true);
      router.push("/");
    });
  }
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    clickCount = 0;
  }, 500);
};
</script>

<style scoped lang="scss">
.header-r {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  max-width: 80%;

  .move {
    flex: 1;
    height: 100%;
  }

  .input {
    width: 300px;
  }

  .circle-btn {
    margin: 0;
    margin-right: 5px;
    // border: 0;
    background-color: v-bind(appBackground);
    border: 1px solid v-bind(appAsideBgColor);
    color: var(--el-color-primary);

    &:first-of-type {
      margin-left: 5px;
    }

    &:hover {
      background-color: v-bind(appAsideBgColor);
      border: 1px solid v-bind(appBackground);
    }
  }
}
</style>
