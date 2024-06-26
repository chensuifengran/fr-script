<template>
  <el-drawer v-model="openOperationRecordDrawer" title="操作录制面板" direction="rtl" size="50%" class="orp-drawer">
    <div class="orp">
      <div w-full>
        <div class="op-item">
          <el-text>合并重复输入的按键</el-text>
          <el-switch v-model="form.merge_key_options.merge_repeat" />
        </div>
        <div class="op-item" v-if="form.merge_key_options.merge_repeat">
          <el-text>需要合并的重复按键按下时间最大间隔(ms)</el-text>
          <el-input-number style="margin-left: 10px;" v-model="form.merge_key_options.repeat_max_interval_ms" :min="1"
            size="small" />
        </div>
        <div class="op-item">
          <el-text>合并相同按键的按下和释放</el-text>
          <el-switch v-model="form.merge_key_options.merge_press_release" />
        </div>
        <div class="op-item" v-if="form.merge_key_options.merge_press_release">
          <el-text>需要合并的按键按下与释放最大间隔(ms)</el-text>
          <el-input-number style="margin-left: 10px;" v-model="form.merge_key_options.press_release_max_interval_ms"
            :min="1" size="small" />
        </div>
        <div class="op-item">
          <el-text>合并相同鼠标按钮按下和释放</el-text>
          <el-switch v-model="form.merge_mouse_options.merge" />
        </div>
        <div class="op-item" v-if="form.merge_mouse_options.merge">
          <el-text>需要合并的鼠标按钮按下与释放最大间隔(ms)</el-text>
          <el-input-number style="margin-left: 10px;" v-model="form.merge_mouse_options.max_interval_ms" :min="1"
            size="small" />
        </div>
        <div class="op-item">
          <el-text>合并鼠标按下与释放时坐标不一致为拖拽</el-text>
          <el-switch v-model="form.merge_mouse_options.merge_drag" />
        </div>
      </div>
      <div w-full>
        <div class="op-item">
          <el-text>生成注释</el-text>
          <el-switch v-model="form.generateComment" />
        </div>
        <div class="op-item">
          <el-text>开始录制时隐藏本窗口</el-text>
          <el-switch v-model="form.hiddenWindowBeforeRunning" />
        </div>
        <div mt-1 flex flex-row flex-items-center flex-justify-center>
          <el-button @click="resetForm">重置选项</el-button>
          <el-button type="primary" @click="startCapture" v-if="!capturing">开始录制</el-button>
          <el-button type="warning" @click="stopCapture" v-else>停止录制</el-button>
        </div>
      </div>
    </div>
  </el-drawer>
  <el-dialog v-model="saveDialog" title="保存操作记录">
    <el-text>将操作记录作为代码片段保存到代码片段仓库,或者仅复制代码片段</el-text>
    <el-form :model="saveConfig" ref="ruleFormRef" :rules="rules">
      <el-form-item label="代码片段名称" prop="name">
        <el-input v-model="saveConfig.name" />
      </el-form-item>
      <el-form-item label="代码片段描述" prop="description">
        <el-input v-model="saveConfig.description" autosize type="textarea" />
      </el-form-item>
      <el-form-item label="代码片段前缀" prop="prefix">
        <el-input v-model="saveConfig.prefix" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="saveDialog = false">取消</el-button>
        <el-button type="primary" @click="copyCode">仅复制</el-button>
        <el-button type="primary" @click="saveCodeSnippets">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { exists } from '@tauri-apps/api/fs';
import { appWindow } from '@tauri-apps/api/window';
import { FormInstance, FormRules } from 'element-plus';
import { nanoid } from 'nanoid';
import { useLocalStorageState } from 'vue-hooks-plus';
const saveDialog = ref(false);
const saveConfig = reactive<SaveConfigForm>({
  name: "",
  description: "",
  prefix: "",
  code: ""
});
const ruleFormRef = ref<FormInstance>();
const nameValidator = (_rule: any, value: any, callback: any) => {
  if (value.trim() === '') {
    callback(new Error('请输入代码片段名称'))
  } else {
    (async () => {
      const savePath = `${await pathUtils.getInstallDir()}\\\\code-snippets\\\\${saveConfig.name}.snippet`;
      if (await exists(savePath)) {
        callback(new Error('名称和已有代码片段重复，换个试试吧'))
      }
      callback()
    })();
  }
}
const rules = reactive<FormRules<SaveConfigForm>>({
  name: [
    { required: true, message: '代码片段前缀不能为空', trigger: 'blur' },
    { validator: nameValidator, trigger: 'blur' },
  ],
  prefix: [
    { required: true, message: '代码片段前缀不能为空', trigger: 'blur' },
    { min: 1, max: 20, message: '代码片段前缀长度在 1 到 20 个字符', trigger: 'blur' }
  ]
})

const listStore = useListStore();
const copyCode = () => {
  try {
    execCopy(saveConfig.code);
    ElMessage.success("操作代码片段复制成功");
  } catch (error) {
    ElMessage.error("操作代码片段复制失败");
    console.error(error);
  } finally {
    saveDialog.value = false;
  }
}
const saveCodeSnippets = async () => {
  if (!ruleFormRef.value) return
  if (!await ruleFormRef.value.validate()) {
    return
  }
  const filePath = `${await pathUtils.getInstallDir()}\\\\code-snippets\\\\${saveConfig.name}.snippet`;
  try {
    await fsUtils.writeFile(filePath, saveConfig.code);
    listStore.codeSnippets.unshift({
      id: nanoid(),
      name: saveConfig.name,
      description: saveConfig.description,
      prefix: saveConfig.prefix,
      filePath
    });
    ElMessage.success("操作代码片段保存成功");
  } catch (error) {
    ElMessage.error("操作代码片段保存失败");
    console.error(error);
  } finally {
    saveDialog.value = false;
    saveConfig.code = "";
    saveConfig.name = "";
    saveConfig.description = "";
    saveConfig.prefix = "";
  }
}
const { openOperationRecordDrawer } = useEditor();
const defaultFormValue = {
  merge_mouse_options: {
    merge: true,
    max_interval_ms: 300,
    merge_drag: true
  },
  merge_key_options: {
    merge_repeat: true,
    repeat_max_interval_ms: 50,
    merge_press_release: true,
    press_release_max_interval_ms: 200
  },
  generateComment: false,
  hiddenWindowBeforeRunning: true
};
const form = ref<CaptureSettingForm>(defaultFormValue);
const [settingForm, setSettingForm] = useLocalStorageState<CaptureSettingForm>('operation-capture-setting-form');

onMounted(() => {
  if (settingForm.value) {
    form.value = JSON.parse(JSON.stringify(settingForm.value))
  }
})
watch(form, () => {
  setSettingForm(form.value);
}, { deep: true });
const resetForm = () => {
  form.value = JSON.parse(JSON.stringify(defaultFormValue));
}

const capturing = ref(false)
const startCapture = async () => {
  capturing.value = true;
  try {
    if (form.value.hiddenWindowBeforeRunning) {
      appWindow.hide();
      await eventUtil.notify.sendCustom({
        name: 'init',
        message: ''
      });
    }
    const res = await invokeBaseApi.captureOperation(
      JSON.parse(JSON.stringify(form.value)), form.value.generateComment);
    await eventUtil.notify.sendCustom({
      name: 'stop',
      message: ''
    });
    saveConfig.name = '操作记录';
    saveConfig.code = res;
    saveDialog.value = true;
  } catch (error) {
    console.error(error);
  } finally {
    capturing.value = false;
  }
}
const stopCapture = () => invokeBaseApi.stopCaptureOperation();
</script>

<style lang="scss">
.orp-drawer {
  overflow: hidden;

  .el-drawer__body {
    overflow: hidden;
  }

  .orp {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    width: 100%;
    height: 100%;

    .op-item {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 5px 10px 5px 10px;
      border-radius: 10px;
      box-sizing: border-box;

      &:hover {
        background-color: var(--el-color-primary-light-9);
      }
    }
  }
}
</style>