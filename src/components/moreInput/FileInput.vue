<template>
  <div>
    <el-input
      spellcheck="false"
      v-model="localValue"
      @input="$emit('update:modelValue', $event)"
    >
      <template #prepend v-if="label !== ''"
        ><span
          style="color: red"
          v-if="!disCheck && localValue.trim().length && !pathExits"
          >{{ label }}</span
        ><span v-else>{{ label }}</span></template
      >
      <template #append>
        <el-button @click="selectFilePath">选择文件</el-button>
      </template>
    </el-input>
    <div v-show="!disCheck && localValue.trim().length && !pathExits" class="tip">
      <el-icon color="red"><IEpCircleCloseFilled /></el-icon
      ><el-tag type="danger">该路径无效，请检查路径填写是否有误</el-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import { exists } from "@tauri-apps/api/fs";
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  parentVisible: {
    type: Boolean,
    default: true,
  },
  disCheck: {
    type: Boolean,
    default: false,
  },
});
const localValue = ref(props.modelValue);
const pathExits = ref(props.disCheck);
// 监听visible变量的变化
watch(
  () => props.parentVisible,
  async (newValue) => {
    if (newValue) {
      // visible为true时，执行检测方法
      pathExits.value = await exists(localValue.value);
    }
  },
  { deep: true } // 设置深度监听
);
watchEffect(async () => {
  if (props.modelValue !== localValue.value) {
    localValue.value = props.modelValue;
    pathExits.value = await exists(localValue.value);
  }
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
const selectFilePath = async () => {
  const filePath = (await pathUtils.selectFile()) as string | undefined;
  emit("update:modelValue", filePath || localValue.value || "");
  localValue.value = filePath || "";
};
watch(localValue, async () => {
  pathExits.value = await exists(localValue.value);
});
onMounted(async () => {
  pathExits.value = await exists(localValue.value);
});
</script>

<style lang="scss" scoped>
.tip {
  display: flex;
  // justify-content: center;
  align-items: center;
}
</style>
<style lang="scss"></style>
