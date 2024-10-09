<template>
  <div class="dep-pkg-item">
    <div class="header">
      <div>
        {{ item.name }} <el-tag size="small">{{ item.version }}</el-tag
        ><span class="desc">{{ item.desc }}</span>
      </div>
      <div>
        <el-button size="small" @click="goDownload(2)" v-if="showAliBtn"
          >阿里云盘下载</el-button
        >
        <el-button size="small" @click="goDownload(1)">移动云盘下载</el-button>
      </div>
    </div>
    <div>
      <el-tag type="info" v-for="file in item.child_files" :key="file">{{ file }}</el-tag>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { invoke } from "@tauri-apps/api/core";

const props = defineProps({
  item: {
    type: Object as PropType<DepPkgItemType>,
    required: true,
  },
  currentVersion: {
    type: String,
    default: "",
  },
});
const {appAsideBgColor:itemBackground, appBackground} = useAppTheme();
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
.dep-pkg-item {
  width: calc(100% - 20px);
  display: flex;
  flex-direction: column;
  background-color: v-bind(itemBackground);
  padding: 5px 10px;
  border-radius: 5px;
  margin-bottom: 5px;
  .header {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .desc {
      margin-left: 10px;
      font-style: italic;
      font-size: 12px;
    }
  }
  &:hover {
    background-color: v-bind(appBackground);
  }
}
</style>
