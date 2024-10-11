<template>
  <div class="list" h-full>
    <el-drawer
      v-model="showEditor"
      :title="targetName"
      :before-close="handleClose"
      direction="ltr"
      size="80%"
    >
      <div id="snippet-editor" w-full h-full></div>
    </el-drawer>
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
    <el-empty
      v-if="showList.length === 0"
      description="暂无代码片段"
      position-absolute
      top-0
      bottom-0
      right-0
      left-0
    />
    <VueDraggable
      ref="el"
      v-model="showList"
      ghostClass="ghost"
      class="draggable-content"
      :disabled="disableSort"
      :animation="200"
      handle=".drag-handle"
      @start="onStart"
      @update="onEnd"
      @end="onEnd"
    >
      <CodeSnippetListItem
        v-for="item in showList"
        :key="item.id"
        :id="item.id"
        @edit-file="editFile"
        @edit-info="editInfo"
        :show-hover="showItemHover"
        @open-file="openFile"
        @del-code-snippets="delCodeSnippets"
      />
    </VueDraggable>
  </div>
</template>

<script lang="ts" setup>
import { invoke } from "@tauri-apps/api/core";
import { storeToRefs } from "pinia";
import { UseDraggableReturn, VueDraggable } from "vue-draggable-plus";
import { MockCodeSnippet } from "../hooks/usePlayMock";
import { SearchTarget } from "../hooks/useAutoTitleBar";
import { DialogBeforeCloseFn } from "element-plus";
const EDITOR_DOM_ID = "snippet-editor";
const showEditor = ref(false);
const targetId = ref("");
const listStore = useListStore();
const headerRef = inject<Ref<HTMLElement | null>>(HEADER_REF_INJECT_KEY);
const { codeSnippets } = storeToRefs(listStore);
const el = ref<UseDraggableReturn>();
let deleteConfirm: () => void = () => {};
const showItemHover = ref(true);
const { editorInit, disposeEditor, findEditor, setText, editorValue } =
  useEditor();
const onStart = () => {
  showItemHover.value = false;
};
const onEnd = () => {
  showItemHover.value = true;
};
const targetName = computed(() => {
  return (
    (IS_PLAYGROUND_ENV
      ? usePlayMock().mockCodeSnippetList
      : codeSnippets
    ).value.find((i) => i.id === targetId.value)?.name || ""
  );
});
const matchExportRegex = /export \{\s?\};?/g;
const handleClose: DialogBeforeCloseFn = async (done) => {
  const newValue = editorValue.value.replace(matchExportRegex, "");
  const target = (
    IS_PLAYGROUND_ENV ? usePlayMock().mockCodeSnippetList : codeSnippets
  ).value.find((i) => i.id === targetId.value) as MockCodeSnippet;
  if (!target) {
    done();
    return;
  }
  const code = IS_PLAYGROUND_ENV
    ? target.content
    : (await fsUtils.readFile(target.filePath)).trim();
  if (newValue.trim() !== code?.trim()) {
    ElMessageBox.confirm("代码已经修改,是否保存?", "提示", {
      confirmButtonText: "保存",
      cancelButtonText: "不保存",
      distinguishCancelAndClose: true,
    })
      .then(async () => {
        if (IS_PLAYGROUND_ENV) {
          target.content = newValue;
          ElNotification({
            title: "提示",
            message: "保存成功",
            type: "success",
            position: "bottom-right",
          });
          done();
          return;
        }
        await fsUtils.writeFile(target.filePath, newValue);
        ElNotification({
          title: "提示",
          message: "保存成功",
          type: "success",
          position: "bottom-right",
        });
        done();
      })
      .catch(done);
  }
  done();
};
const deleteCodeSnippetDialog = ref(false);
const delCodeSnippets = (index: number) => {
  deleteConfirm = async () => {
    if (IS_PLAYGROUND_ENV) {
      usePlayMock().mockCodeSnippetList.value.splice(index, 1);
      ElNotification({
        title: "提示",
        message: "删除成功",
        type: "success",
        position: "bottom-right",
      });
      deleteCodeSnippetDialog.value = false;
      return;
    }
    if (
      !(await fsUtils.deleteFile(
        (IS_PLAYGROUND_ENV ? usePlayMock().mockCodeSnippetList : codeSnippets)
          .value[index].filePath
      ))
    ) {
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
const editFile = async (index: number) => {
  showEditor.value = true;
  await nextTick();
  const target = (
    IS_PLAYGROUND_ENV ? usePlayMock().mockCodeSnippetList : codeSnippets
  ).value[index] as MockCodeSnippet;
  targetId.value = target.id;
  const editorExists = findEditor(EDITOR_DOM_ID);
  if (!editorExists) {
    await editorInit(EDITOR_DOM_ID, false, false);
  }
  const code = IS_PLAYGROUND_ENV
    ? target.content
    : await fsUtils.readFile(target.filePath);
  setText(EDITOR_DOM_ID, "export {};\n" + code?.trim() || "");
};
const editInfoDialog = ref(false);
const editInfoDialogForm = reactive({
  name: "",
  description: "",
  prefix: "",
});
let editInfoDialogCb = () => {};
let lastTargetName = "";
const editInfo = async (index: number) => {
  const target = (
    IS_PLAYGROUND_ENV ? usePlayMock().mockCodeSnippetList : codeSnippets
  ).value[index] as MockCodeSnippet;
  editInfoDialogForm.name = target.name;
  lastTargetName = target.name;
  editInfoDialogForm.description = target.description;
  editInfoDialogForm.prefix = target.prefix;
  editInfoDialogCb = () => {
    const existLikeName = (
      IS_PLAYGROUND_ENV ? usePlayMock().mockCodeSnippetList : codeSnippets
    ).value.find((i) => i.name === editInfoDialogForm.name);
    if (existLikeName && lastTargetName !== editInfoDialogForm.name) {
      ElMessage.warning("已存在相同名称的代码片段，换个名字试试吧");
      return;
    }
    const target = (
      IS_PLAYGROUND_ENV ? usePlayMock().mockCodeSnippetList : codeSnippets
    ).value[index];
    target.name = editInfoDialogForm.name;
    target.description = editInfoDialogForm.description;
    target.prefix = editInfoDialogForm.prefix;
    editInfoDialog.value = false;
    ElMessage.success("修改成功");
  };
  editInfoDialog.value = true;
};
const openFile = async (index: number) => {
  if (IS_PLAYGROUND_ENV) {
    ElNotification({
      title: "提示",
      message: "playground环境无法打开代码片段文件",
      type: "warning",
      position: "bottom-right",
    });
    return;
  }
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
      invoke("open_file_explorer", {
        path: await pathUtils.resolve(path, "../"),
      });
    }
  }
};
const { trueSearch, searchInfo, ingoreObserver } = useAutoTitleBar();
const disableSort = computed(() => {
  return trueSearch.value !== "";
});
const showList = computed({
  get: () => {
    const value = trueSearch.value;
    if (value === "") {
      const list = (
        IS_PLAYGROUND_ENV ? usePlayMock().mockCodeSnippetList : codeSnippets
      ).value;
      return list;
    } else {
      const list = (
        IS_PLAYGROUND_ENV ? usePlayMock().mockCodeSnippetList : codeSnippets
      ).value.filter(
        (i) =>
          i.name.toLowerCase().includes(value.toLowerCase()) ||
          i.description.toLowerCase().includes(value.toLowerCase()) ||
          i.prefix.toLowerCase().includes(value.toLowerCase())
      );
      return list;
    }
  },
  set: (v) => {
    (IS_PLAYGROUND_ENV
      ? usePlayMock().mockCodeSnippetList
      : codeSnippets
    ).value = v;
  },
});
const observerCallback: IntersectionObserverCallback = (entries) => {
  entries.forEach((entry) => {
    if (ingoreObserver.value) {
      return;
    }
    searchInfo.show = !entry.isIntersecting;
  });
};
let observer: IntersectionObserver;
onUnmounted(() => {
  disposeEditor();
  ingoreObserver.value = true;
  searchInfo.show = false;
  searchInfo.target = SearchTarget.None;
  if (observer && headerRef?.value) {
    observer.unobserve(headerRef?.value);
  }
});
onMounted(() => {
  invokeBaseApi.closeSplashscreen();
  observer = new IntersectionObserver(observerCallback, {});
  if (headerRef?.value) {
    observer.observe(headerRef?.value);
  }
  searchInfo.target = SearchTarget.CodeSnippetList;
});
</script>

<style lang="scss" scoped>
.ghost {
  opacity: 0.9;
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
</style>
