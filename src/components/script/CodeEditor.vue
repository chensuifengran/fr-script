<template>
  <div class="script-editor-dev">
    <el-page-header @back="goBack" class="header">
      <template #content>
        <span class="text-small font-200 flex items-center">
          {{ fileInfo.name }}<span v-show="editorValue !== fileInfo.originData">*</span
          ><el-tag size="small" type="success" v-show="fileInfo.declare">已声明</el-tag
          ><el-tag size="small" type="warning" v-show="!fileInfo.declare">未声明</el-tag>
          <el-button
            class="tool-bar-item"
            v-if="!fileInfo.declare"
            link
            size="small"
            type="primary"
            @click="declareMod.visible = true"
            >插入声明</el-button
          >
        </span>
      </template>
      <template #extra>
        <div class="flex items-center">
          <el-button @click="openApiTest">打开调试窗口</el-button>
          <el-button @click="openFileDialogVisible = true">打开文件</el-button>
          <el-button @click="runScript">运行</el-button>
          <el-button type="primary" @click="saveScriptFile">保存</el-button>
        </div>
      </template>
    </el-page-header>
    <div id="codeEditBox" v-show="showEditor"></div>
    <div class="loading" v-show="!showEditor">
      <Loading />
      <div>编辑器加载中...</div>
    </div>
    <div class="auto-api-tip scrollbar" @wheel.stop="wheelHandle" ref="scrollbarRef">
      <el-tag
        style="margin-right: 3px"
        size="small"
        type="success"
        v-show="fnInfo?.haveAuxiliary"
        >Ctrl+Tab ：快速填写/修改参数</el-tag
      >
      <el-tag size="small" type="info" v-show="fnInfo?.name && fnInfo?.content"
        >{{ fnInfo?.name }}:{{ fnInfo?.content }}
      </el-tag>
    </div>
  </div>
  <!-- 打开方式选择弹窗 -->
  <el-dialog v-model="openFileDialogVisible" title="选择打开方式">
    <div>文件夹：打开文件所在文件夹</div>
    <div>默认方式：以系统默认方式打开文件</div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="openFile(1)">文件夹</el-button>
        <el-button @click="openFile(2)">默认方式</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 添加文件声明的弹窗 -->
  <el-dialog v-model="declareMod.visible" title="插入脚本声明">
    <div>脚本名称</div>
    <el-input v-model="declareMod.name" />
    <div>脚本版本</div>
    <el-input v-model="declareMod.version" />
    <div>脚本描述</div>
    <el-input v-model="declareMod.description" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="declareMod.visible = false">取消</el-button>
        <el-button type="primary" @click="insertDeclare"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 新建脚本保存弹窗 -->
  <el-dialog v-model="saveMod.visible" title="保存脚本">
    <div>请选择脚本的保存路径</div>
    <el-input v-model="saveMod.savePath">
      <template #append>
        <el-button type="primary" @click="chooseSavePath">选择</el-button>
      </template>
    </el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="saveMod.visible = false">取消</el-button>
        <el-button type="primary" @click="saveNewScript"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 运行未保存脚本弹窗 -->
  <el-dialog v-model="autoSaveDialog.visible" title="运行脚本">
    <div>检测到当前脚本已做更改，若不保存则运行最后一次保存的内容</div>
    <el-checkbox
      v-model="scriptStore.runAutoSave"
      label="不再提醒,下次运行自动保存,可在设置页关闭自动保存"
      size="large"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="autoSaveDialog.close_cb">直接运行</el-button>
        <el-button type="primary" @click="autoSaveDialog.cb"> 保存后运行 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { useScriptApi } from "@renderer/hook/useScriptApi";
import { useScriptStore } from "@renderer/store/scriptStore";
import { SCRIPT_TEMPLATE } from "@renderer/utils/constantUtils";
import { Ref } from "vue";
import { nanoid } from "nanoid";
import { useADBMethodsRegister } from "@renderer/hook/useADBMethodsRegister";
import { useDllMethodsRegister } from "@renderer/hook/useDllMethodsRegister";
import { AutoTipUtils } from "@renderer/runTimeApis/autoTipApis";
import { useUtilMethodsRegister } from "@renderer/hook/useUtilMethodsRegister";

const fs = require("fs");
const scriptStore = useScriptStore();
const {
  getEditor,
  editorInit,
  editorValue,
  insertText,
  setText,
  formatCode,
  disposeEditor,
} = useScriptApi()!;
const { invokeDialog } = useADBMethodsRegister();
const { openDialog } = useDllMethodsRegister();
const { openUtilDialog } = useUtilMethodsRegister();

const fnInfo = AutoTipUtils.getFnInfo();
const { apiAutoTip } = AutoTipUtils;
const showEditor = ref(true);

const getFileInfo = (type: "id" | "savePath" | "name" | "version" | "description") => {
  const target = scriptStore.scriptList.find((s) => s.id === openId!.value);
  if (target === undefined) {
    console.error("未找到对应脚本");
    return "";
  }
  switch (type) {
    case "id":
      return target!.id;
    case "name":
      return target!.name;
    case "description":
      return target.description;
    case "savePath":
      return target.savePath;
    case "version":
      return target.version;
    default:
      console.error(type);
      return type;
  }
};
const scrollbarRef = ref<HTMLElement>();
const openFileDialogVisible = ref(false);
const openFile = (type: 1 | 2) => {
  openFileDialogVisible.value = false;
  const path = getFileInfo("savePath");
  let t: "showItemInFolder" | "openPath" = "showItemInFolder";
  if (type === 2) {
    t = "openPath";
  }
  window.api.openFile({
    path,
    type: t,
  });
};
const wheelHandle = (event) => {
  event.preventDefault();
  //拿到y轴滚动的距离，让menuBoxRef的横向滚动跟着滚动
  const { deltaY } = event;
  scrollbarRef.value!.scrollLeft += deltaY;
};
const curShow = inject<Ref<"index" | "editor" | "console">>("curShow");
const preloadPath = inject<Ref<string>>("preloadPath")!;
const fileInfo = reactive({
  originData: "",
  version: "",
  description: "",
  name: "未命名脚本",
  savePath: "",
  declare: false,
});
const testApiWinId = inject<Ref<number>>("testApiWinId");
const saveMod = reactive({
  savePath: "",
  visible: false,
  cb: <(res: boolean) => void>(() => {}),
});
const autoSaveDialog = reactive({
  visible: false,
  cb: <() => void>(() => {}),
  close_cb: <() => void>(() => {}),
});
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
    if (fileInfo.savePath.trim().length) {
      //编辑的脚本，直接写入内容
      try {
        if (editorValue.value !== fileInfo.originData) {
          fs.writeFileSync(fileInfo.savePath, editorValue.value);
          fileInfo.originData = editorValue.value;
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
const chooseSavePath = async () => {
  const path = await window.api.saveFile();
  saveMod.savePath = path;
  fileInfo.savePath = path;
};
const saveNewScript = () => {
  saveMod.visible = false;
  try {
    fs.writeFileSync(fileInfo.savePath, editorValue.value);
    fileInfo.originData = editorValue.value;
    const id = nanoid();
    scriptStore.scriptList.push({
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
const insertDeclare = () => {
  insertText(
    `/**
 * 请勿删除，此声明会在脚本读取时用到！
 * @version:${declareMod.version}
 * @name:${declareMod.name}
 * @description:${declareMod.description}
 */`,
    true
  );
  declareMod.description = "无";
  declareMod.name = "未命名脚本";
  declareMod.version = "v1.0";
  declareMod.visible = false;
};
const declareMod = reactive({
  visible: false,
  name: "未命名",
  version: "v1.0",
  description: "无",
  title: "插入脚本声明",
  targetFn: insertDeclare,
});
const aside_width = inject<Ref<string>>("aside_width");
const goBack = () => {
  curShow!.value = "index";
  preloadText.value = "";
  aside_width!.value = "110px";
  if (testApiWinId?.value !== -1) window.api.invokeMainHandle("hideApiTestWin");
};
onBeforeUnmount(() => {
  document.getElementById("codeEditBox")?.removeEventListener("keydown", keydownHandle);
  // getEditor() && (getEditor() as any).dispose();
  disposeEditor();
});
const keydownHandle = (e: KeyboardEvent) => {
  const key = e.key;
  if (key === "s" && e.ctrlKey) {
    formatCode();
    const t = setTimeout(() => {
      saveScriptFile();
      clearTimeout(t);
    }, 200);
    e.preventDefault();
  } else if (key === "Tab" && e.ctrlKey) {
    if (fnInfo.value) {
      if (!fnInfo.value.haveAuxiliary) {
        ElNotification({
          title: "提示",
          message: "当前函数无需填写参数",
          type: "info",
          position: "bottom-right",
        });
        return;
      }
      const replaceParams = (targetArgs: string) => {
        insertText(targetArgs, false, fnInfo.value!.paramsRange);
      };
      if (fnInfo.value.fnType === "adb") {
        invokeDialog(
          fnInfo.value.name,
          fnInfo.value.name,
          fnInfo.value.content || "",
          "changeArgs",
          replaceParams,
          fnInfo.value.params
        );
      } else if (fnInfo.value.fnType === "dll") {
        openDialog(
          fnInfo.value.name,
          fnInfo.value.content || "",
          fnInfo.value.name,
          "changeArgs",
          replaceParams,
          fnInfo.value.params
        );
      } else {
        openUtilDialog(
          fnInfo.value.name,
          fnInfo.value.name,
          fnInfo.value.content || "",
          fnInfo.value.params,
          replaceParams
        );
      }
    }
  }
};

const cheekDeclare = () => {
  //修复因编辑器初始化进行类型检查，导致直接运行脚本时在scriptStore里面对应脚本的正确信息覆盖
  if (curShow!.value !== "editor") return;
  const v = editorValue.value;
  if (v.indexOf(" */") === -1) {
    fileInfo.declare = false;
  } else {
    const targetStrPosition = v.indexOf(" */") + 3;
    const targetStr = editorValue.value.substring(0, targetStrPosition);
    const dm = {
      name: "",
      version: "",
      description: "",
    };
    targetStr
      .replaceAll("/**", "")
      .replace(/ \* -{19}提示-{19}[\s\S]* \* -{42}/, "")
      .replaceAll("\n * ", "")
      .replaceAll("\n */", "")
      .trim()
      .split("@")
      .forEach((i: string) => {
        if (i !== "") {
          const attributeArr = i.split(":");
          if (attributeArr[0] === "version") {
            dm.version = attributeArr[1];
          } else if (attributeArr[0] === "name") {
            dm.name = attributeArr[1];
          } else if (attributeArr[0] === "description") {
            dm.description = attributeArr[1];
          }
        }
      });

    if (dm.description === "" || dm.name === "" || dm.version === "") {
      //声明不完整
      fileInfo.declare = false;
    } else {
      const targetIndex = scriptStore.scriptList.findIndex((s) => {
        return s.id === openId?.value;
      });
      if (openId?.value !== "-1") {
        scriptStore.scriptList[targetIndex].version = dm.version;
        scriptStore.scriptList[targetIndex].name = dm.name;
        scriptStore.scriptList[targetIndex].description = dm.description;
      }
      fileInfo.declare = true;
      fileInfo.version = dm.version;
      fileInfo.name = dm.name;
      fileInfo.description = dm.description;
    }
  }
};

let cheekDeclareTimer: NodeJS.Timeout;
watch(editorValue, () => {
  cheekDeclareTimer && clearTimeout(cheekDeclareTimer);
  cheekDeclareTimer = setTimeout(() => {
    clearTimeout(cheekDeclareTimer);
    cheekDeclare();
  }, 500);
});
const cursorHandle = (_e) => {
  apiAutoTip();
};
const resizeHandle = () => {
  getEditor()?.layout();
};
onMounted(() => {
  showEditor.value = false;
  window.addEventListener("resize", resizeHandle);
  editorInit();
  getFile();
  document.getElementById("codeEditBox")?.addEventListener("keydown", keydownHandle);
  nextTick(() => {
    getEditor()?.onDidChangeCursorPosition(cursorHandle);
    setText(fileInfo.originData || SCRIPT_TEMPLATE);
    cheekDeclare();
    const t = setTimeout(() => {
      showEditor.value = true;
      clearTimeout(t);
    }, 400);
  });
});
onUnmounted(() => {
  window.removeEventListener("resize", resizeHandle);
  document.getElementById("codeEditBox")?.removeEventListener("keydown", keydownHandle);
});
const openApiTest = async () => {
  if (testApiWinId?.value === -1) {
    testApiWinId.value = await window.api.createWindow("/apiTest?showSlide=false");
  }
  if (!(await window.api.windowIsExist(testApiWinId!.value))) {
    testApiWinId!.value = await window.api.createWindow("/apiTest?showSlide=false");
  }

  window.api.openApiTestWindow(testApiWinId!.value);
};
const tempEditorValue = inject("tempEditorValue") as Ref<string>;
const runScript = () => {
  const unsaveRun = () => {
    tempEditorValue.value = editorValue.value;
    autoSaveDialog.visible = false;
    curShow!.value = "console";
    if (testApiWinId?.value !== -1) window.api.invokeMainHandle("hideApiTestWin");
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
  if (editorValue.value !== fileInfo.originData) {
    if (scriptStore.runAutoSave) {
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
const openId = inject<Ref<string>>("openId");
const getFile = () => {
  if (openId!.value !== "-1" && curShow!.value === "editor") {
    const path = getFileInfo("savePath");
    if (path) {
      try {
        fileInfo.originData = fs.readFileSync(path, "utf-8");
        fileInfo.name = getFileInfo("name")!;
        fileInfo.description = getFileInfo("description")!;
        fileInfo.savePath = path;
        fileInfo.version = getFileInfo("version")!;
        setText(fileInfo.originData);
      } catch (e) {
        console.error(e);
        ElNotification({
          title: "提示",
          message: "文件读取失败，进入新增模式",
          type: "error",
          position: "bottom-right",
        });
        fileInfo.originData = SCRIPT_TEMPLATE;
        fileInfo.savePath = "";
        setText(SCRIPT_TEMPLATE);
        return;
      }
    } else {
      fileInfo.originData = SCRIPT_TEMPLATE;
      fileInfo.savePath = "";
      setText(SCRIPT_TEMPLATE);
      ElNotification({
        title: "提示",
        message: "文件读取失败，路径为空，进入新增模式",
        type: "error",
        position: "bottom-right",
      });
    }
  } else if (openId!.value === "-1" && curShow?.value === "editor") {
    //-1表示新建脚本
    fileInfo.originData = SCRIPT_TEMPLATE;
    fileInfo.savePath = "";
    setText(SCRIPT_TEMPLATE);
  }
};
watch(openId!, getFile);
const preloadText = inject<Ref<string>>("preloadText")!;

watchEffect(() => {
  const text = preloadText.value;
  nextTick(() => {
    setText(text);
  });
});
</script>
<style scoped lang="scss">
.script-editor-dev {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .header {
    height: 35px;
  }
  .loading {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .scrollbar {
    width: 100%;
    height: 25px;
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: scroll;
    &:hover {
      &::-webkit-scrollbar-thumb {
        background-color: #1b9945;
      }
      &::-webkit-scrollbar {
        height: 4px;
      }
    }
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
    &::-webkit-scrollbar-thumb,
    &::-webkit-scrollbar-track {
      background-color: #a2ddc2;
    }

    &::before {
      content: "";
      width: 0;
      height: 30px;
    }
  }
  .auto-api-tip {
    padding: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 12px;
    span {
      flex-shrink: 0;
    }
  }
  #codeEditBox {
    height: calc(100% - 65px);
    margin-top: 5px;
  }
}
</style>
<style lang="scss">
.el-empty {
  height: 100%;
}
</style>
