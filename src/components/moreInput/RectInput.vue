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
// const { exportAllFn } = useDllMethodsRegister();
// const { getImgRectInfo } = exportAllFn();
const props = defineProps({
  modelValue: {
    type: Object as PropType<
      | {
          x: number;
          y: number;
          width: number;
          height: number;
        }
      | Record<string, any>
    >,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  targetSrc: {
    type: String,
    default: "",
  },
});
const info = reactive(props.modelValue);
const copyParam = () => {
  copyRectParam(
    info as {
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
};
// const { getRectInfo } = useGetScreenRect();
const emit = defineEmits<{
  (
    e: "update:modelValue",
    value: {
      x: number;
      y: number;
      width: number;
      height: number;
    }
  ): void;
}>();
const selectRect = async () => {
  // let res;
  // if (props.targetSrc && props.targetSrc !== "") {
  //   res = await getImgRectInfo(props.targetSrc);
  // } else {
  //   res = await getRectInfo();
  // }
  // const { startX: x, startY: y, width, height } = res;
  // emit("update:modelValue", {
  //   x,
  //   y,
  //   width,
  //   height,
  // });
  // info.x = x;
  // info.y = y;
  // info.width = width;
  // info.height = height;
};
watch(info, () => {
  emit(
    "update:modelValue",
    info as {
      x: number;
      y: number;
      width: number;
      height: number;
    }
  );
});
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
<style lang="scss"></style>
