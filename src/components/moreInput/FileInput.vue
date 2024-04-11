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
      <el-autocomplete
        v-model="value"
        :fetch-suggestions="querySearch"
        size="small"
        @select="selectHandler"
      >
        <template #prepend v-if="label !== '' && label.length <= 10"
          ><el-text
            :style="{
              color: pathExits ? undefined : 'red',
            }"
          >
            {{ label }}
          </el-text></template
        >
        <template #append>
          <el-button @click="selectFilePath">选择文件</el-button>
        </template>
        <template #default="{ item }">
          <div class="suggestion-item">
            <el-text>{{ item.value }}</el-text
            ><el-tag size="small">{{ item.label }}</el-tag>
          </div>
        </template>
      </el-autocomplete>
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
type SuggestionItem = {
  label: string;
  value: string;
};
const suggestions = reactive<SuggestionItem[]>([]);
const querySearch = (queryString: string, cb: (s: SuggestionItem[]) => void) => {
  const results = queryString
    ? suggestions.filter((item) => {
        return item.value.includes(queryString) || item.label.includes(queryString);
      })
    : suggestions;
  cb(results);
};
onMounted(async () => {
  const appGSStore = useAppGlobalSettings();
  const workDir = appGSStore.envSetting.workDir;
  const screenshotPath = appGSStore.envSetting.screenshotSavePath;
  const installDir = await pathUtils.getInstallDir();
  suggestions.push({
    label: "工作目录",
    value: workDir,
  });
  suggestions.push({
    label: "截图路径",
    value: screenshotPath,
  });
  suggestions.push({
    label: "安装目录",
    value: installDir,
  });
});
const value = defineModel<string | string[]>({
  default: "",
});
const selectHandler = (item: Record<string, any>) => {
  value.value = item.value;
};
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
.suggestion-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
</style>
<style lang="scss"></style>
