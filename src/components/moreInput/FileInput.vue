<template>
  <div class="file-input-content">
    <template v-if="typeof value === 'string'">
      <el-text
        v-if="label !== '' && label.length > 10"
        :style="{
          color: pathExits ? undefined : 'red',
        }"
      >
        {{ label }}
      </el-text>
      <el-input spellcheck="false" v-model="value" size="small">
        <template #prepend v-if="label !== '' && label.length <= 10"
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
    </template>
    <template v-else>
      <el-text
        v-if="label !== ''"
        :style="{
          color: pathExits ? undefined : 'red',
        }"
      >
        {{ label }}
      </el-text>
      <div class="path-content">
        <el-tag
          class="tag"
          v-for="p in value"
          :key="p"
          size="small"
          :type="!unExists.includes(p) ? 'success' : 'danger'"
          closable
          :disable-transitions="false"
          @close="handleClose(p)"
        >
          {{ p }}
        </el-tag>
        <el-button class="w-100" size="small" @click="selectFilePath">
          +选择文件
        </el-button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { exists } from "@tauri-apps/api/fs";
import { ElInput } from "element-plus";
const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  verify: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  stringSeparator: {
    type: String,
    default: "|",
  },
});
const value = defineModel<string | string[]>({
  default: "",
});

const handleClose = (tag: string) => {
  (value.value as string[]).splice(value.value.indexOf(tag), 1);
};

const unExists = reactive<string[]>([]);
const pathExits = ref(true);
const selectFilePath = async () => {
  const filePath = await fsUtils.selectFile(props.multiple);
  if (filePath) {
    if (props.multiple) {
      //多选filePath的类型是string[]
      if (value.value instanceof Array) {
        value.value = [...new Set([...value.value, ...filePath])];
      } else {
        value.value = (filePath as string[]).join(props.stringSeparator);
      }
    } else {
      value.value = filePath as string;
    }
  }
};
watch(value, async () => {
  if (!props.verify) return;
  if (typeof value.value === "string") {
    pathExits.value = await exists(value.value);
  } else {
    unExists.splice(0, unExists.length);
    for (const path of value.value) {
      if (!(await exists(path))) {
        unExists.push(path);
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.tip {
  display: flex;
  // justify-content: center;
  align-items: center;
}
.w-100 {
  width: 100px;
}
.file-input-content {
  display: flex;
  flex-direction: column;
  .path-content {
    display: flex;
    flex-flow: wrap;
    .tag {
      margin: 3px;
    }
  }
}
</style>
<style lang="scss"></style>
