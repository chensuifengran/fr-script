<template>
  <div class="pointer-util-content">
    <div class="title">
      <span data-tauri-drag-region style="cursor: move">鼠标工具</span>
      <div data-tauri-drag-region style="cursor: move" class="move"></div>
      <div class="btns">
        <el-tooltip effect="dark" content="清空记录" placement="bottom">
          <el-button class="btn" size="small" @click="clean" circle><el-icon>
              <span i-mdi-invoice-text-remove-outline></span>
            </el-icon></el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="关闭" placement="bottom">
          <el-button class="btn" size="small" @click="closePointerUtil" circle><el-icon>
              <span i-mdi-close></span>
            </el-icon></el-button>
        </el-tooltip>
      </div>
    </div>
    <div class="content">
      <div class="mini-tip">
        <el-text size="small" type="primary">复制成功</el-text><el-icon size="small">
          <span i-mdi-clipboard-check-outline></span>
        </el-icon>
      </div>
      <div class="info">
        <el-text>pos:{{ pos.join(",") }}</el-text>
        <div class="color-show"></div>
      </div>
      <el-scrollbar class="record" height="80">
        <div v-for="(record, index) in records" :key="index" class="record-item">
          <el-text size="small">({{ record.pos.join(",") }}) → </el-text>
          <div class="color-block" :style="{
            backgroundColor: `rgb(${record.rgbColor.join(',')})`,
          }"></div>
          <el-button size="small" class="copy-btn" @click="copyRgb(record.rgbColor)" link><el-icon>
              <span i-mdi-content-copy></span>
            </el-icon></el-button>
        </div>
        <div class="empty" v-if="!records.length">
          <el-text size="small">暂无内容，按下</el-text>
          <el-tag type="primary" size="small">{{ globalShortcutStore.getShortcuts("记录鼠标位置及颜色") }}</el-tag>
          <el-text size="small">记录鼠标点对应的颜色</el-text>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { isRegistered, register, unregister } from "@tauri-apps/plugin-global-shortcut";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
const appWindow = getCurrentWebviewWindow()
const { appAsideBgColor, appBackground } = useAppTheme();
const globalShortcutStore = useGlobalShortcutsStore();
const copyRgb = (rgb: [number, number, number]) => {
  showTip();
  return execCopy(rgb.join(","));
};
const pos = ref<[number, number]>([0, 0]);
const rgbColor = ref<[number, number, number]>([60, 60, 60]);
const color = computed(() => `rgb(${rgbColor.value.join(",")})`);
const records = reactive<
  {
    pos: [number, number];
    rgbColor: [number, number, number];
  }[]
>([]);
const closePointerUtil = () => {
  appWindow.close();
};

let utilInterval: any;
const clean = () => {
  records.splice(0, records.length);
};
onMounted(async () => {
  const s = globalShortcutStore.getShortcuts("记录鼠标位置及颜色");
  if (await isRegistered(s)) {
    await unregister(s);
  }
  register(s, () => {
    records.unshift({
      pos: pos.value,
      rgbColor: rgbColor.value,
    });
  });
  utilInterval = setInterval(async () => {
    const { x, y } = await invokeBaseApi.getMousePos();
    if (x === pos.value[0] && y === pos.value[1]) {
      return;
    }
    pos.value = [x, y];
    const res = await invokeBaseApi.screenColor(x, y);
    if (res.message === "success") {
      rgbColor.value = res.data;
    }
  }, 100);
});
onBeforeUnmount(async () => {
  clearInterval(utilInterval);
  const s = globalShortcutStore.getShortcuts("记录鼠标位置及颜色");
  await unregister(s);
});
const tipTransform = ref("translateX(-100%)");
const showTip = () => {
  tipTransform.value = "translateX(0)";
  setTimeout(() => {
    tipTransform.value = "translateX(-100%)";
  }, 2000);
};
</script>
<style lang="scss" scoped>
.pointer-util-content {
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;

  .content {


    height: calc(100% - 35px);
    width: 100%;
    position: relative;
    padding: 0 10px;
    box-sizing: border-box;

    .mini-tip {
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
      background-color: #ddf0e1;
      color: #07c500;
      padding: 0 5px;
      border-radius: 0 5px 5px 0;
      flex-direction: row;
      align-items: center;
      transform: v-bind(tipTransform);
      transition: all 0.5s;
    }

    .info {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      .color-show {
        width: 16px;
        height: 16px;
        background-color: v-bind(color);
      }
    }

    .record {
      background-color: v-bind(appAsideBgColor);
      height: 80px;
      box-sizing: border-box;
      width: 100%;
      position: relative;

      .empty {
        width: 100%;
        height: 80px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .record-item {
        user-select: text;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1px;
        background-color: v-bind(appBackground);
        padding: 0 5px;

        .color-block {
          display: inline-block;
          width: 12px;
          height: 12px;
        }

        .copy-btn {
          opacity: 0;
        }

        &:hover {
          background-color: v-bind(appAsideBgColor);

          .copy-btn {
            opacity: 1;
          }
        }
      }
    }
  }

  .title {
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 35px;
    background-color: v-bind(appAsideBgColor);
    border-bottom: 1px solid v-bind(appBackground);

    .move {
      flex: 1;
      height: 35px;
    }

    .btns {
      width: 50px;

      .btn {
        margin: 0;
        padding: 0;
      }
    }
  }
}
</style>
