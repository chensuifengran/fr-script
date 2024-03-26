<template>
  <div class="script-editor-dev">
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
        v-model="appGSStore.editor.runAutoSave"
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
</template>
<script lang="ts" setup>
import { UnlistenFn, listen } from "@tauri-apps/api/event";
import { nanoid } from "nanoid";
import { storeToRefs } from "pinia";
const appGSStore = useAppGlobalSettings();
const listStore = useListStore();
const { scriptList } = storeToRefs(listStore);
const {
  getEditor,
  editorInit,
  editorValue,
  insertText,
  setText,
  formatCode,
  disposeEditor,
  registerEditorEvent,
  unRegisterEditorEvent,
} = useScriptApi()!;
const {
  openId,
  preloadText,
  preloadPath,
  isEditing,
  fileInfo,
  declareMod,
  saveMod,
} = useScriptInfo();
const { invokeDynamicDialog } = useCore();
const fnInfo = AutoTipUtils.getFnInfo();
const { apiAutoTip } = AutoTipUtils;
const showEditor = ref(true);
const getFileInfo = (type: "id" | "savePath" | "name" | "version" | "description") => {
  const target = scriptList.value.find((s) => s.id === openId!.value);
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
const wheelHandle = (event: any) => {
  event.preventDefault();
  //拿到y轴滚动的距离，让menuBoxRef的横向滚动跟着滚动
  const { deltaY } = event;
  scrollbarRef.value!.scrollLeft += deltaY;
};
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
          await fsUtils.writeFile(fileInfo.savePath, editorValue.value);
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
  const path = (await fsUtils.selectFile(false)) as string | undefined;
  if (path) {
    saveMod.savePath = path;
    fileInfo.savePath = path;
  }
};
const saveNewScript = async () => {
  saveMod.visible = false;
  try {
    await fsUtils.writeFile(fileInfo.savePath, editorValue.value);
    fileInfo.originData = editorValue.value;
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
      message: JSON.stringify(e),
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
          message: "当前函数无需填写参数或不支持快速填写参数。",
          type: "info",
          position: "bottom-right",
        });
        return;
      }
      const replaceParams = (targetArgs: string) => {
        insertText(targetArgs, false, fnInfo.value!.paramsRange);
      };
      if (fnInfo.value.fnType === "invokeApi") {
        invokeDynamicDialog(
          fnInfo.value.name,
          fnInfo.value.name,
          fnInfo.value.content || "",
          "changeArgs",
          replaceParams,
          fnInfo.value.params
        );
      } else if (fnInfo.value.fnType === "util") {
        //TODO util方法的快捷参数填写弹窗
      }
    }
  }
};
let checkDeclareTimer: any = null;
const checkDeclare = () => {
  if (router.currentRoute.value.name !== "scriptEditor") return;
  checkDeclareTimer && clearTimeout(checkDeclareTimer);
  checkDeclareTimer = setTimeout(() => {
    clearTimeout(checkDeclareTimer);
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
        const targetIndex = scriptList.value.findIndex((s) => {
          return s.id === openId?.value;
        });
        if (openId?.value !== "-1") {
          scriptList.value[targetIndex].version = dm.version;
          scriptList.value[targetIndex].name = dm.name;
          scriptList.value[targetIndex].description = dm.description;
        }
        fileInfo.declare = true;
        fileInfo.version = dm.version;
        fileInfo.name = dm.name;
        fileInfo.description = dm.description;
      }
    }
  }, 500);
};
watch(editorValue, () => {
  checkDeclare();
});
const cursorHandle = (_e: any) => {
  apiAutoTip();
  fileInfo.lastData = editorValue.value;
};
const resizeHandle = () => {
  getEditor()?.layout();
};
let windowFocusHandle: UnlistenFn;
const loadContent = async (type: "focus" | "init" = "init", path?: string) => {
  if (!path) {
    const p = getFileInfo("savePath");
    if (!p) {
      return;
    }
    path = p;
  }
  const newContent = await fsUtils.readFile(path);
  if (fileInfo.originData === newContent) {
    return;
  }
  if (type === "focus" && editorValue.value !== fileInfo.originData) {
    // try {
    //   await ElMessageBox.confirm(
    //     "检测到当前脚本源内容已改变，是否载入最新内容，此操作将覆盖当前编辑器内容！",
    //     "同步数据",
    //     {
    //       confirmButtonText: "载入最新内容",
    //       cancelButtonText: "保留当前内容",
    //       type: "warning",
    //       confirmButtonClass: "el-button--warning",
    //     }
    //   );
    // } catch (error) {
    //   return;
    // }
    fileInfo.originData = newContent;
    return;
  }
  fileInfo.originData = newContent;
  fileInfo.name = getFileInfo("name")!;
  fileInfo.description = getFileInfo("description")!;
  fileInfo.savePath = path;
  fileInfo.version = getFileInfo("version")!;
  setText(fileInfo.originData);
  type === "focus" && ElMessage.info("已载入最新内容");
};
onMounted(async () => {
  isEditing.value = true;
  showEditor.value = false;
  window.addEventListener("resize", resizeHandle);
  editorInit();
  await getFile();
  document.getElementById("codeEditBox")?.addEventListener("keydown", keydownHandle);
  registerEditorEvent("mounted", (editor: any) => {
    editor.onDidChangeCursorPosition(cursorHandle);
    setText(fileInfo.originData || SCRIPT_TEMPLATE);
    const t = setTimeout(() => {
      checkDeclare();
      showEditor.value = true;
      clearTimeout(t);
    }, 200);
  });
  windowFocusHandle = await listen("tauri://focus", () => {
    loadContent("focus");
  });
});
onBeforeUnmount(() => {
  unRegisterEditorEvent("mounted");
  window.removeEventListener("resize", resizeHandle);
  document.getElementById("codeEditBox")?.removeEventListener("keydown", keydownHandle);
  disposeEditor();
  isEditing.value = false;
  windowFocusHandle && windowFocusHandle();
});
const getFile = async () => {
  const currentName = router.currentRoute.value.name;
  if (openId!.value !== "-1" && currentName === "scriptEditor") {
    const path = getFileInfo("savePath");
    if (path) {
      try {
        loadContent("init", path);
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
  } else if (openId!.value === "-1" && currentName === "scriptEditor") {
    //-1表示新建脚本
    fileInfo.originData = SCRIPT_TEMPLATE;
    fileInfo.savePath = "";
    setText(SCRIPT_TEMPLATE);
  }
};
watch(openId!, getFile);
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
    height: calc(100% - 25px);
  }
}
</style>
<style lang="scss">
.el-empty {
  height: 100%;
}
</style>
