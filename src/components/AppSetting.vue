<script setup lang="ts">
import { Sunny, Moon } from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";
import { getVersion } from "@tauri-apps/api/app";
import { invoke } from "@tauri-apps/api/tauri";
const { selectFile, selectDir } = pathUtils;
const version = ref("获取版本失败");
getVersion().then((res) => {
  version.value = res;
});

const appGSStore = useAppGlobalSettings();
const { app, envSetting, ocr } = storeToRefs(appGSStore);
const isDark = inject<globalThis.WritableComputedRef<boolean>>("isDark")!;
const darkState = ref(false);
darkState.value = isDark.value;
let timer: any;
watch(darkState, () => {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    isDark.value = darkState.value;
  }, 300);
});
const chooseWorkDir = async () => {
  const res = await selectDir();
  if (res) {
    envSetting.value.workDir = res;
  }
};
const chooseScreenshotSavePath = async () => {
  const res = await selectFile();
  if (res) {
    envSetting.value.screenshotSavePath = res;
  }
};
onMounted(async () => {
  const d_version: string = await invoke("get_dependence_version");
  console.log(d_version);

  app.value.dependentSerial = d_version;
});
</script>
<template>
  <div class="setting-div">
    <h3>App</h3>
    <div class="setting-item">
      <span>版本</span>
      <span
        ><el-tag type="info" size="small">{{ version }}</el-tag
        ><el-button link type="primary">检查更新</el-button></span
      >
    </div>
    <div class="setting-item">
      <span>依赖序列号</span>
      <span
        ><el-tag type="info" size="small">{{ app.dependentSerial }}</el-tag
        ><el-button link type="primary">安装依赖库</el-button></span
      >
    </div>
    <div class="setting-item">
      <span>全局主题</span>
      <el-switch v-model="darkState" :active-icon="Moon" :inactive-icon="Sunny" />
    </div>
    <div class="setting-item">
      <span>编辑器主题</span>
      <el-select v-model="app.editorTheme.value" placeholder="编辑器主题" size="small">
        <el-option
          v-for="item in app.editorTheme.options"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <h3>OCR服务</h3>
    <div class="setting-item">
      <span>运行方式</span>
      <el-select v-model="ocr.value" placeholder="OCR运行方式" size="small">
        <el-option v-for="item in ocr.options" :key="item" :label="item" :value="item" />
      </el-select>
    </div>
    <div class="setting-item" v-show="ocr.value === 'GPU'">
      <span>GPU内存占用(MB)</span>
      <el-input-number v-model="ocr.gpuMemory" :min="1" size="small" />
    </div>
    <h3>环境设置</h3>
    <div class="setting-item">
      <span>工作目录</span>
      <span
        ><el-tag type="info" size="small">{{ envSetting.workDir }}</el-tag
        ><el-button link type="primary" @click="chooseWorkDir">选择</el-button></span
      >
    </div>
    <div class="setting-item">
      <span>截图保存路径</span>
      <span
        ><el-tag type="info" size="small">{{ envSetting.screenshotSavePath }}</el-tag
        ><el-button link type="primary" @click="chooseScreenshotSavePath"
          >选择</el-button
        ></span
      >
    </div>
    <div class="setting-item">
      <span>临时文件保存盘符</span>
      <el-select
        v-model="envSetting.tempDrivePath.value"
        placeholder="临时文件保存盘符"
        size="small"
      >
        <el-option
          v-for="item in envSetting.tempDrivePath.options"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.setting-div {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 5px 10px;
  box-sizing: border-box;
  overflow-y: scroll;
  .setting-item {
    display: flex;
    width: 100%;
    height: 40px;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 15px;
    padding-right: 15px;
    border-radius: 20px;
    box-sizing: border-box;
    align-items: center;
    transition: all 0.3s;
    &:hover {
      background: var(--el-color-primary-light-9);
    }
  }
}
</style>
<style lang="scss">
.setting-item .el-switch__label * {
  font-size: large;
}
</style>
