<template>
  <div class="card">
    <div class="title">
      <el-text
        >截取{{
          props.targetSrc.trim().length === 0 ? "屏幕" : "图片"
        }}指定位置</el-text
      >
      <div class="title-btns">
        <el-button :disabled="props.disabled" size="small" @click="useParam"
          >填入参数</el-button
        >
        <el-button :disabled="props.disabled" size="small" @click="copyParam"
          >复制参数</el-button
        >
        <el-button :disabled="props.disabled" size="small" @click="selectRect"
          >截取屏幕矩形</el-button
        >
      </div>
    </div>
    <div class="content">
      <div class="line">
        <el-input
          :disabled="props.disabled"
          size="small"
          v-model.number="info.x"
          ><template #prepend>x</template></el-input
        >
        <el-input
          :disabled="props.disabled"
          size="small"
          v-model.number="info.y"
          ><template #prepend>y</template></el-input
        >
      </div>
      <div class="line">
        <el-input
          :disabled="props.disabled"
          size="small"
          v-model.number="info.width"
          ><template #prepend>width(宽)</template></el-input
        >
        <el-input
          :disabled="props.disabled"
          size="small"
          v-model.number="info.height"
          ><template #prepend>height(高)</template></el-input
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { oppositeBgColor } = useAppTheme();
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
  disabled: {
    type: Boolean,
    default: false,
  },
});
const useParam = async () => {
  try {
    let { value } = await ElMessageBox.prompt(
      "格式：x,y,width,height，例如：0,0,100,100",
      "快速填入参数",
      {
        inputValue: "",
      }
    );
    value = value.replace(/\s/g, "");
    if (value.length > 0) {
      let arr = value.split(",");
      if (arr.length !== 4) {
        arr = value.split("，");
        if (arr.length !== 4) {
          ElNotification({
            title: "参数格式错误",
            message: "请按照格式填写参数",
            type: "error",
            position: "bottom-right",
          });
          return;
        }
      }
      info.value.x = parseInt(arr[0]);
      info.value.y = parseInt(arr[1]);
      info.value.width = parseInt(arr[2]);
      info.value.height = parseInt(arr[3]);
    }
  } catch (error) {}
};
const selectRect = async () => {
  try {
    if (props.targetSrc && props.targetSrc !== "") {
      const imgInfo = await invokeBaseApi.getImgRectInfo(props.targetSrc);
      info.value.x = imgInfo.startX;
      info.value.y = imgInfo.startY;
      info.value.width = imgInfo.width;
      info.value.height = imgInfo.height;
    } else {
      const screenRectInfo = await invokeBaseApi.getScreenRectInfo();
      info.value.x = screenRectInfo.startX;
      info.value.y = screenRectInfo.startY;
      info.value.width = screenRectInfo.width;
      info.value.height = screenRectInfo.height;
      return;
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 0 10px 0 v-bind(oppositeBgColor);

  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .content {
    margin-top: 5px;

    .line {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-top: 3px;
    }
  }
}
</style>
<style lang="scss"></style>
