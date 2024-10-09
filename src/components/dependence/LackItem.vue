<template>
  <div class="lack-dep-item">
    <div v-if="item.currentVersion">
      {{ item.name }}
      <el-tag type="info" size="small">{{ item.currentVersion }}->{{ item.version }}</el-tag>
    </div>
    <div v-else>
      {{ item.name }} <el-tag type="info" size="small">{{ item.version }}</el-tag>
    </div>
    <div>
      <el-button size="small" @click="goDownload(2)" v-if="showAliBtn">阿里云盘下载</el-button>
      <el-button size="small" @click="goDownload(1)">移动云盘下载</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { invoke } from "@tauri-apps/api/core";

const props = defineProps({
  item: {
    type: Object as PropType<NeedUpdateDepType>,
    required: true,
  },
  currentVersion: {
    type: String,
    default: "",
  },
});
const { appAsideBgColor: itemBackground, appBackground } = useAppTheme();
const showAliBtn = computed(() => {
  return !!props.item.download_url.find((item) => item.origin === "阿里云盘");
});

const goDownload = async (type: number) => {
  if (type === 1) {
    const caiYun = props.item.download_url.find((item) =>
      item.origin.includes("移动云盘")
    );
    if (caiYun) {
      await invoke("open_in_default_browser", {
        url: caiYun.url,
      });
      if (caiYun.pwd) {
        execCopy(caiYun.pwd);
        ElNotification({
          title: "提示",
          message: "移动云盘提取码已复制到剪切板",
          type: "success",
          position: "bottom-right",
        });
      }
    } else {
      ElNotification({
        title: "提示",
        message: "未找到移动云盘下载链接",
        type: "error",
        position: "bottom-right",
      });
    }
  } else {
    const aliYun = props.item.download_url.find((item) =>
      item.origin.includes("阿里云盘")
    );
    if (aliYun) {
      await invoke("open_in_default_browser", {
        url: aliYun.url,
      });
      if (aliYun.pwd) {
        execCopy(aliYun.pwd);
        ElNotification({
          title: "提示",
          message: "阿里云盘提取码已复制到剪切板",
          type: "success",
          position: "bottom-right",
        });
      }
    } else {
      ElNotification({
        title: "提示",
        message: "未找到阿里云盘下载链接",
        type: "error",
        position: "bottom-right",
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.lack-dep-item {
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 10px;
  box-sizing: border-box;
  border-radius: 5px;
  margin-bottom: 5px;
  background: v-bind(itemBackground);

  &:hover {
    background: v-bind(appBackground);
  }
}
</style>
