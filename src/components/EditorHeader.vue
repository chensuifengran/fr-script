<template>
  <common-header
    :title="fileInfo.name"
    :height="35"
    allow-drag
    @back="goBack"
  >
    <template #before>
      <span v-show="isDifferentValue">*</span
      ><el-tag size="small" :type="fileInfo.declare ? 'success' : 'warning'">{{
        fileInfo.version
      }}</el-tag>
      <el-button
        w-50px
        mr-5px
        v-if="!fileInfo.declare"
        link
        size="small"
        type="primary"
        @click="declareMod.visible = true"
        style="pointer-events: all"
        >插入声明</el-button
      >
    </template>
    <div class="btns">
      <div class="dragable" data-tauri-drag-region style="cursor: move"></div>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="显示操作录制面板"
        placement="bottom"
      >
        <el-button size="small" @click="showOperationRecord" circle
          ><el-icon size="large">
            <span i-solar-videocamera-record-outline></span> </el-icon
        ></el-button>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="打开鼠标工具"
        placement="bottom"
      >
        <el-button size="small" @click="openPointerUtil" circle
          ><el-icon size="large"> <span i-solar-mouse-linear></span> </el-icon
        ></el-button>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="打开调试窗口"
        placement="bottom"
      >
        <el-button size="small" @click="openApiTest" circle>
          <el-icon size="large"><span i-mdi-function-variant></span></el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="前往脚本设置"
        placement="bottom"
      >
        <el-button size="small" @click="goSetScript" circle
          ><el-icon size="large">
            <span i-solar-settings-linear></span> </el-icon
        ></el-button>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="打开脚本"
        placement="bottom"
      >
        <el-button size="small" @click="openFile" circle
          ><el-icon size="large">
            <span i-mdi-folder-eye-outline></span> </el-icon
        ></el-button>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="运行脚本"
        placement="bottom"
      >
        <el-button size="small" @click="runScript" circle>
          <el-icon size="large">
            <span i-mdi-play-circle-outline></span>
          </el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="[Ctrl+S]保存"
        placement="bottom"
      >
        <el-button size="small" type="primary" @click="saveScriptFile" circle>
          <el-icon size="large">
            <span i-mdi-content-save-outline></span>
          </el-icon>
        </el-button>
      </el-tooltip>
    </div>
    <slot />
  </common-header>
</template>
<script lang="ts" setup>
import { invoke } from "@tauri-apps/api/core";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { nanoid } from "nanoid";
import { storeToRefs } from "pinia";

const appGSStore = useAppGlobalSettings();
const {
  openId,
  tempEditorValue,
  preloadText,
  preloadPath,
  contentTransform,
  asideBarPos,
  fileInfo,
  declareMod,
  saveMod,
  autoSaveDialog,
  isEditing,
} = useScriptInfo();
const { getEditorValue, openOperationRecordDrawer } = useEditor();
const isDifferentValue = computed(() => {
  const v = getEditorValue("codeEditBox");
  if (!v) {
    return !fileInfo.originData;
  }
  const isDifferent = v.value !== fileInfo.originData;
  return isDifferent;
});
const { open } = windowUtil;
const openApiTest = async () => {
  if (IS_PLAYGROUND_ENV) {
    ElNotification({
      title: "提示",
      message: "playground环境下无法打开调试窗口,请前往API调试",
      type: "warning",
      position: "bottom-right",
    });
    return;
  }
  const targetWindow = await open("apiTest", "/apiTest");
  targetWindow?.show();
};
const openPointerUtil = async () => {
  if (IS_PLAYGROUND_ENV) {
    ElNotification({
      title: "提示",
      message: "playground环境下无法打开鼠标工具",
      type: "warning",
      position: "bottom-right",
    });
    return;
  }
  const targetWindow = await open("pointerUtil", "/pointerUtil", {
    height: 140,
    width: 150,
    alwaysOnTop: true,
  });
  targetWindow?.show();
};
const showOperationRecord = async () => {
  openOperationRecordDrawer.value = !openOperationRecordDrawer.value;
};
const goSetScript = () => {
  asideBarPos.value = "relative";
  contentTransform.value = "translateX(0)";
  isEditing.value = false;
  router.replace("/script/setting");
};
const openFile = async () => {
  if (IS_PLAYGROUND_ENV) {
    ElNotification({
      title: "提示",
      message: "playground环境下无法打开脚本文件",
      type: "warning",
      position: "bottom-right",
    });
    return;
  }
  const path = fileInfo.savePath;
  try {
    await ElMessageBox.confirm(
      `打开脚本所在目录 或者 尝试使用vscode打开脚本文件`,
      "请选择打开方式",
      {
        confirmButtonText: "vscode",
        cancelButtonText: "文件夹",
        distinguishCancelAndClose: true,
      }
    );
    execCommand.run(`code ${path}`);
  } catch (error: any) {
    if (error === "cancel") {
      invoke("open_file_explorer", {
        path: await pathUtils.resolve(path, "../"),
      });
    }
  }
};
const runScript = () => {
  const editorValue = getEditorValue("codeEditBox");
  const unsaveRun = () => {
    tempEditorValue.value = editorValue?.value || "";
    autoSaveDialog.visible = false;
    if (!IS_PLAYGROUND_ENV) {
      const testWindow = WebviewWindow.getByLabel("apiTest");
      testWindow.then((testWindow) => {
        testWindow?.hide();
      });
    }
    router.replace({
      path: "/script/run",
    });
    asideBarPos.value = "relative";
    contentTransform.value = "translateX(0)";
  };
  const saveRun = async () => {
    const res = await saveScriptFile();
    unsaveRun();
    if (!res) {
      ElNotification({
        title: "保存失败",
        message: "直接运行最后一次保存的版本",
        type: "error",
      });
    }
  };
  if (editorValue?.value !== fileInfo.originData) {
    if (appGSStore.editor.runAutoSave) {
      saveRun();
    } else {
      autoSaveDialog.cb = saveRun;
      autoSaveDialog.close_cb = unsaveRun;
      autoSaveDialog.visible = true;
    }
  } else {
    unsaveRun();
  }
};
const saveScriptFile = async () => {
  if (!fileInfo.declare) {
    ElNotification({
      title: "保存失败",
      message: "保存之前请先在脚本头部插入'脚本声明'或者将脚本声明补充完整",
      type: "error",
      position: "bottom-right",
    });
    return false;
  } else {
    if (IS_PLAYGROUND_ENV) {
      const editorValue = getEditorValue("codeEditBox");
      usePlayMock().mockScriptList.value.find(
        (s) => s.id === openId!.value
      )!.content = editorValue?.value || "";
      fileInfo.originData = editorValue?.value || "";
      ElNotification({
        title: "提示",
        message: "保存成功",
        type: "success",
        position: "bottom-right",
      });
      return true;
    }
    if (fileInfo.savePath.trim().length) {
      //编辑的脚本，直接写入内容
      try {
        const editorValue = getEditorValue("codeEditBox");
        if (editorValue?.value !== fileInfo.originData) {
          await fsUtils.writeFile(fileInfo.savePath, editorValue?.value || "");
          fileInfo.originData = editorValue?.value || "";
          ElNotification({
            title: "提示",
            message: "保存成功",
            type: "success",
            position: "bottom-right",
          });
          return true;
        } else {
          //内容无变化，不需要保存
          return true;
        }
      } catch (e: any) {
        console.error(e);
        ElNotification({
          title: "保存失败",
          message: "未知错误，详见控制台",
          type: "error",
          position: "bottom-right",
        });
        return false;
      }
    } else {
      if (preloadPath.value !== "") {
        //导入未声明的脚本，声明之后直接保存到preloadPath，不需要弹出选择保存路径弹窗
        fileInfo.savePath = preloadPath.value;
        preloadPath.value = "";
        return saveNewScript();
      } else {
        //新建的脚本，需要弹出提示框选择保存位置
        saveMod.visible = true;
        return new Promise<boolean>((resolve) => {
          saveMod.cb = resolve;
        });
      }
    }
  }
};
const saveNewScript = async () => {
  saveMod.visible = false;
  try {
    const editorValue = getEditorValue("codeEditBox");
    await fsUtils.writeFile(fileInfo.savePath, editorValue?.value || "");
    fileInfo.originData = editorValue?.value || "";
    const id = nanoid();
    scriptList.value.push({
      id,
      savePath: fileInfo.savePath,
      name: fileInfo.name,
      version: fileInfo.version,
      description: fileInfo.description,
      setting: {
        autoImportLastRunConfig: false,
        targetAdbDevice: "",
        excludeDevice: [],
        targetApp: "",
        autoStartTargetApp: false,
      },
    });
    openId!.value = id;
    ElNotification({
      title: "提示",
      message: "保存成功",
      type: "success",
      position: "bottom-right",
    });
    return true;
  } catch (e: any) {
    console.error(e);
    ElNotification({
      title: "保存失败",
      message: "未知错误，详见控制台",
      type: "error",
      position: "bottom-right",
    });
    return false;
  }
};
const listStore = useListStore();
const { scriptList } = storeToRefs(listStore);
const goBack = () => {
  router.replace({
    path: "/script/list",
  });
  preloadText.value = "";
  asideBarPos.value = "relative";
  contentTransform.value = "translateX(0)";
  if (IS_PLAYGROUND_ENV) {
    return;
  }
  const testWindow = WebviewWindow.getByLabel("apiTest");
  testWindow.then((testWindow) => {
    testWindow?.hide();
  });
};
</script>

<style lang="scss" scoped>
.btns {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 5px;
}
</style>
