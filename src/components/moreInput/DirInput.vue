<template>
  <div>
    <el-input spellcheck="false" v-model="value">
      <template #prepend v-if="label !== ''"
        ><span
          :style="{
            color: pathExits ? undefined : 'red',
          }"
          >{{ label }}</span
        ></template
      >
      <template #append>
        <el-button @click="selectFilePath">选择路径</el-button>
      </template>
    </el-input>
    <div v-show="!pathExits" class="tip">
      <el-icon color="red"><IEpCircleCloseFilled /></el-icon
      ><el-tag type="danger"
        >该路径无效，请检查路径填写是否有误，请检查路径填写是否有误</el-tag
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { exists } from "@tauri-apps/api/fs";
const value = defineModel<string>({
  default: "",
});
const pathExits = ref(true);
const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  suffix: {
    type: String,
    default: "",
  },
  prefix: {
    type: String,
    default: "",
  },
  verify: {
    type: Boolean,
    default: false,
  },
});
watch(value, async () => {
  if (!props.verify) return;
  pathExits.value = await exists(value.value);
});
const selectFilePath = async () => {
  let filePath = (await fsUtils.selectFile()) as string | undefined;
  if (props.suffix && props.suffix.length > 0) {
    filePath += props.suffix;
  }
  if (props.prefix && props.prefix.length > 0) {
    filePath = props.prefix + filePath;
  }
  value.value = filePath || "";
};
</script>

<style lang="scss" scoped>
.tip {
  display: flex;
  align-items: center;
}
</style>
<style lang="scss"></style>
