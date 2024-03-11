<template>
  <div>
    <el-input spellcheck="false" v-model="value" size="small">
      <template #prepend v-if="label !== ''"
        ><span
          :style="{
            color: pathExits ? undefined : 'red',
          }"
          >{{ label }}</span
        ></template
      >
      <template #append>
        <el-button @click="selectFilePath">选择文件</el-button>
      </template>
    </el-input>
    <div v-show="!pathExits" class="tip">
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
  verify: {
    type: Boolean,
    default: false,
  },
});
const value = defineModel<string>({
  default: "",
});
const pathExits = ref(true);
const selectFilePath = async () => {
  const filePath = (await fsUtils.selectFile(false)) as string | undefined;
  value.value = filePath || "";
};
watch(value, async () => {
  if (!props.verify) return;
  pathExits.value = await exists(value.value);
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
