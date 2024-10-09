<template>
  <div>
    <el-text
      v-if="props.label !== '' && props.label.length > 10"
      :style="{
        color: pathExits ? undefined : 'red',
      }"
    >
      {{ props.label }}
    </el-text>
    <el-autocomplete
      v-model="value"
      :fetch-suggestions="querySearch"
      size="small"
      @select="selectHandler"
      :disabled="props.disabled"
    >
      <template #prepend v-if="props.label !== '' && props.label.length <= 10"
        ><el-text
          :style="{
            color: pathExits ? undefined : 'red',
          }"
        >
          {{ props.label }}
        </el-text></template
      >
      <template #append>
        <el-button @click="selectFilePath">选择路径</el-button>
      </template>
      <template #default="{ item }">
        <div class="suggestion-item">
          <el-text>{{ item.value }}</el-text
          ><el-tag size="small">{{ item.label }}</el-tag>
        </div>
      </template>
    </el-autocomplete>
    <div v-show="!pathExits" class="tip">
      <el-icon color="red"> <span i-mdi-close></span> </el-icon
      ><el-tag type="danger"
        >该路径无效，请检查路径填写是否有误，请检查路径填写是否有误</el-tag
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { exists } from "@tauri-apps/plugin-fs";

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
  disabled: {
    type: Boolean,
    default: false,
  },
});
type SuggestionItem = {
  label: string;
  value: string;
};
const suggestions = reactive<SuggestionItem[]>([]);
const querySearch = (
  queryString: string,
  cb: (s: SuggestionItem[]) => void
) => {
  const results = queryString
    ? suggestions.filter((item) => {
        return (
          item.value.includes(queryString) || item.label.includes(queryString)
        );
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
  if (IS_PLAYGROUND_ENV) {
    return;
  }
  suggestions.push({
    label: "安装目录",
    value: installDir,
  });
});
const selectHandler = (item: Record<string, any>) => {
  value.value = item.value;
};
watch(value, async () => {
  if (!props.verify) return;
  pathExits.value = await exists(value.value);
});
const selectFilePath = async () => {
  if(IS_PLAYGROUND_ENV){
    value.value = "E:\\playground\\";
    return;
  }
  let filePath = (await fsUtils.selectFile(false)) as string | undefined;
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

.suggestion-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
</style>
<style lang="scss"></style>
