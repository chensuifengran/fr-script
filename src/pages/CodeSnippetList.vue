<template>
  <div class="container-root">
    <el-drawer v-model="showEditor" :title="targetName" :before-close="handleClose" direction="ltr" size="80%"
      class="orp-drawer">
      <div id="snippet-editor" w-full h-full></div>
    </el-drawer>
    <div class="code-snippet-list-div">
      <!-- 删除代码片段弹窗 -->
      <el-dialog v-model="deleteCodeSnippetDialog" title="删除代码片段">
        <div>确定要删除该代码片段吗?</div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="deleteCodeSnippetDialog = false">取消</el-button>
            <el-button type="danger" @click="deleteConfirm">删除</el-button>
          </span>
        </template>
      </el-dialog>
      <!-- 编辑代码片段信息弹窗 -->
      <el-dialog v-model="editInfoDialog" title="编辑代码片段信息">
        <div>代码片段名称:</div>
        <el-input v-model="editInfoDialogForm.name" />
        <div>代码片段描述:</div>
        <el-input v-model="editInfoDialogForm.description" />
        <div>代码片段前缀:</div>
        <el-input v-model="editInfoDialogForm.prefix" />
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editInfoDialog = false">取消</el-button>
            <el-button type="primary" @click="editInfoDialogCb">保存</el-button>
          </span>
        </template>
      </el-dialog>
      <el-affix target=".code-snippet-list-div" :offset="40">
        <div class="header">
          <span style="font-size: 18px">代码片段列表</span>
          <div class="header-right">
            <el-input class="input" v-model="search" clearable placeholder="搜索代码片段:名称、备注、前缀" />
            <el-button-group>
              <el-button @click="imoprtScript">导入</el-button>
              <el-button type="primary" @click="onAddItem">新建</el-button>
            </el-button-group>
          </div>
        </div>
      </el-affix>
      <div class="list" h-full>
        <el-empty v-if="codeSnippets.length === 0" description="暂无代码片段" position-absolute top-0 bottom-0 right-0
          left-0 />
        <VueDraggable ref="el" v-model="showList" ghostClass="ghost" class="draggable-content" :disabled="disableSort"
          :animation="200" handle=".drag-handle" @start="onStart" @update="onEnd" @end="onEnd">
          <CodeSnippetListItem v-for="item in showList" :key="item.id" :id="item.id" @edit-file="editFile" @edit-info="editInfo"
            :show-hover="showItemHover" @open-file="openFile" @del-code-snippets="delCodeSnippets" />
        </VueDraggable>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { invoke } from "@tauri-apps/api";
import { DialogBeforeCloseFn } from "element-plus";
import { storeToRefs } from "pinia";
import { UseDraggableReturn, VueDraggable } from 'vue-draggable-plus'
const EDITOR_DOM_ID = "snippet-editor";
const showEditor = ref(false);
const targetId = ref("");
const targetName = computed(() => {
  return codeSnippets.value.find(i => i.id === targetId.value)?.name || ""
})
const el = ref<UseDraggableReturn>();
let deleteConfirm: () => void = () => { };
const listStore = useListStore();
const { codeSnippets } = storeToRefs(listStore);
const { saveDialog, saveConfig, showCopyBtn } = useCodeSnippetSave();
const showItemHover = ref(true);
const {
  editorInit,
  disposeEditor,
  findEditor,
  setText,
  editorValue,
} = useEditor();
const onStart = () => {
  showItemHover.value = false;
};
const onEnd = () => {
  showItemHover.value = true;
}
const deleteCodeSnippetDialog = ref(false);
const delCodeSnippets = (index: number) => {
  deleteConfirm = async () => {
    if (!await fsUtils.deleteFile(codeSnippets.value[index].filePath)) {
      ElNotification({
        title: "提示",
        message: "删除失败",
        type: "error",
        position: "bottom-right",
      });
      return;
    }
    codeSnippets.value.splice(index, 1);
    ElNotification({
      title: "提示",
      message: "删除成功",
      type: "success",
      position: "bottom-right",
    });
    deleteCodeSnippetDialog.value = false;
  };
  deleteCodeSnippetDialog.value = true;
};
const matchExportRegex = /export \{\s?\};?/g;
const editFile = async (index: number) => {
  showEditor.value = true;
  await nextTick();
  const target = codeSnippets.value[index];
  targetId.value = target.id;
  const editorExists = findEditor(EDITOR_DOM_ID);
  if (!editorExists) {
    await editorInit(EDITOR_DOM_ID, false, false);
  }
  const code = await fsUtils.readFile(target.filePath);
  setText(EDITOR_DOM_ID, 'export {};\n' + code.trim());
};
const editInfoDialog = ref(false);
const editInfoDialogForm = reactive({
  name: "",
  description: "",
  prefix: ""
});
let editInfoDialogCb = ()=>{};
const editInfo = async (index: number)=>{
  const target = codeSnippets.value[index];
  editInfoDialogForm.name = target.name;
  editInfoDialogForm.description = target.description;
  editInfoDialogForm.prefix = target.prefix;
  editInfoDialogCb = ()=>{
    const existLikeName = codeSnippets.value.find(i => i.name === editInfoDialogForm.name);
    if(existLikeName){
      ElMessage.warning('已存在相同名称的代码片段，换个名字试试吧');
      return
    }
    const target = codeSnippets.value[index];
    target.name = editInfoDialogForm.name;
    target.description = editInfoDialogForm.description;
    target.prefix = editInfoDialogForm.prefix;
    editInfoDialog.value = false;
    ElMessage.success('修改成功');
  }
  editInfoDialog.value = true;
}
const handleClose: DialogBeforeCloseFn = async (done) => {
  const newValue = editorValue.value.replace(matchExportRegex, "");
  const target = codeSnippets.value.find(i => i.id === targetId.value);
  if (!target) {
    done();
    return;
  }
  const code = (await fsUtils.readFile(target.filePath)).trim();
  if (newValue.trim() !== code.trim()) {
    ElMessageBox.confirm("代码已经修改,是否保存?", "提示", {
      confirmButtonText: "保存",
      cancelButtonText: "不保存",
      distinguishCancelAndClose: true,
    }).then(async () => {
      await fsUtils.writeFile(target.filePath, newValue);
      ElNotification({
        title: "提示",
        message: "保存成功",
        type: "success",
        position: "bottom-right",
      });
      done();
    }).catch(done);
  }
  done();
};
const openFile = async (index: number) => {
  const path = codeSnippets.value[index].filePath;
  try {
    await ElMessageBox.confirm(
      "打开代码片段所在目录 或者 尝试使用vscode打开代码片段文件",
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
      invoke("open_file_explorer", { path: await pathUtils.resolve(path, "../") });
    }
  }
};

const onAddItem = () => {
  saveConfig.code = "";
  saveConfig.name = "操作记录";
  saveConfig.description = "";
  saveConfig.prefix = "";
  saveDialog.value = true;
  showCopyBtn.value = false;
};

const imoprtScript = async () => {
  const filePath = (await fsUtils.selectFile(false, [
    {
      name: "",
      extensions: ["js", "ts"],
    },
  ])) as string | undefined;
  if (filePath) {
    try {
      const originData = await fsUtils.readFile(filePath);
      if (codeSnippets.value.find((i) => i.filePath === filePath) !== undefined) {
        //该文件已经导入
        ElNotification({
          title: "提示",
          message: "该文件已经导入",
          type: "warning",
          position: "bottom-right",
        });
        return;
      }
      saveConfig.code = originData;
      saveConfig.name = "操作记录";
      saveConfig.description = "";
      saveConfig.prefix = "";
      saveDialog.value = true;
    } catch (e) {
      console.error(e);
      ElNotification({
        title: "提示",
        message: "文件读取失败",
        type: "error",
        position: "bottom-right",
      });
    }
  } else {
    ElNotification({
      title: "提示",
      message: "取消导入",
      type: "info",
      position: "bottom-right",
    });
  }
};

const search = ref("");
const disableSort = computed(() => {
  return search.value !== ""
})

const showList = computed({
  get: () => {
    if (search.value === "") {
      return codeSnippets.value;
    } else {
      return codeSnippets.value.filter(
        (i) =>
          i.name.toLowerCase().includes(search.value.toLowerCase()) ||
          i.description.toLowerCase().includes(search.value.toLowerCase()) ||
          i.prefix.toLowerCase().includes(search.value.toLowerCase())
      );
    }
  },
  set: (v) => {
    codeSnippets.value = v;
  }
});
const { appAsideBgColor, appBackground } = useAppTheme();
const { isEditing } = useScriptInfo();
const background = computed(() => {
  if (isEditing.value) {
    return appAsideBgColor?.value;
  } else {
    return appBackground?.value;
  }
});
const mainBorderRadius = computed(() => {
  if (isEditing.value) {
    return "0";
  } else {
    return "10px 10px 10px 0";
  }
});
onUnmounted(() => {
  disposeEditor();
})
onMounted(()=>{
  invokeBaseApi.closeSplashscreen();
})
</script>

<style lang="scss" scoped>
.ghost {
  opacity: 0.9;
}

.container-root {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 0;
  box-sizing: border-box;
  overflow-x: hidden;
  background: v-bind(background);
  border-radius: v-bind(mainBorderRadius);

  .code-snippet-list-div {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 10px;
    padding: 10px;
    padding-top: 0;

    .header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 5px;
      box-sizing: border-box;
      border-radius: 10px;
      background-color: v-bind(appBackground);

      .header-right {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;

        .input {
          width: 260px;
          margin-right: 10px;
        }
      }
    }

    .list {
      width: 100%;
      position: relative;
      padding: 2px 3px;
      box-sizing: border-box;
      border-radius: 5px;

      .draggable-content {
        width: 100%;
        height: 100%;
        position: relative;
        transition: all 0.5s;
      }
    }
  }
}
</style>
<style lang="scss">
.code-snippet-list-div {
  .el-affix {
    width: 100%;
  }
}
</style>
