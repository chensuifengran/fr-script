<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>截取指定位置</span>
        <div>
          <el-button @click="copyParam">复制参数</el-button>
          <el-button @click="selectRect">截取屏幕矩形</el-button>
        </div>
      </div>
    </template>
    <el-input v-model.number="info.x"><template #prepend>x</template></el-input>
    <el-input v-model.number="info.y"><template #prepend>y</template></el-input>
    <el-input v-model.number="info.width"><template #prepend>width</template></el-input>
    <el-input v-model.number="info.height"><template #prepend>height</template></el-input>
  </el-card>
</template>

<script setup lang="ts">
import { invoke } from "@tauri-apps/api";

const info = defineModel<
  | {
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | Record<string, any>
>({
  required: false,
  default: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
});
const copyParam = () => {
  try {
    copyRectParam(
      info.value as {
        x: number;
        y: number;
        width: number;
        height: number;
      }
    );
    ElNotification({
      title: "复制成功",
      message: "已复制到剪贴板",
      type: "success",
      position: "bottom-right",
    });
  } catch (e) {
    ElNotification({
      title: "复制失败",
      message: JSON.stringify(e),
      type: "error",
      position: "bottom-right",
    });
  }
};
const props = defineProps({
  targetSrc: {
    type: String,
    default: "",
  },
});
const selectRect = async () => {
  try {
    if (props.targetSrc && props.targetSrc !== "") {
      const imgInfo = await invoke<string>("get_img_rect_info", {
        imgPath: props.targetSrc,
      });
      const json = JSON.parse(imgInfo);
      info.value.x = json.startX;
      info.value.y = json.startY;
      info.value.width = json.width;
      info.value.height = json.height;
    } else {
      ElNotification({
        title: "截取失败",
        message: "未传入图片地址",
        type: "error",
        position: "bottom-right",
      });
      return;
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
<style lang="scss"></style>
