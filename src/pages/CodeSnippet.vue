<template>
  <div class="container-root" @scroll="onScrollHandler">
    <div class="code-snippet">
      <div class="header" ref="headerRef">
        <span style="font-size: 18px">代码片段列表</span>
        <div class="header-right">
          <el-input
            class="input"
            v-model="searchInfo.content"
            clearable
            placeholder="搜索代码片段:名称、备注、前缀"
          />
          <el-button-group>
            <el-button @click="imoprtScript">导入</el-button>
            <el-button type="primary" @click="onAddItem">新建</el-button>
          </el-button-group>
        </div>
      </div>
      <code-snippet-list />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { nanoid } from "nanoid";
import { templateRef } from "@vueuse/core";
const listStore = useListStore();
const headerRef = templateRef("headerRef");
provide(HEADER_REF_INJECT_KEY, headerRef);
const { codeSnippets } = storeToRefs(listStore);
const { saveDialog, saveConfig, showCopyBtn } = useCodeSnippetSave();
const onAddItem = () => {
  saveConfig.code = "";
  saveConfig.name = "操作记录";
  saveConfig.description = "";
  saveConfig.prefix = "";
  saveDialog.value = true;
  showCopyBtn.value = false;
};
const imoprtScript = async () => {
  if (IS_PLAYGROUND_ENV) {
    const target = usePlayMock().mockCodeSnippetList;
    target.value.push({
      id: nanoid(),
      name: "操作记录" + target.value.length,
      description: "操作记录" + target.value.length,
      prefix: "test" + target.value.length,
      content: "",
      filePath: "playground",
    });
    return;
  }
  const filePath = (await fsUtils.selectFile(false, [
    {
      name: "",
      extensions: ["js", "ts"],
    },
  ])) as string | undefined;
  if (filePath) {
    try {
      const originData = await fsUtils.readFile(filePath);
      if (
        codeSnippets.value.find((i) => i.filePath === filePath) !== undefined
      ) {
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
const { searchInfo, ingoreObserver } = useAutoTitleBar();
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
const onScrollHandler = () => {
  if (ingoreObserver.value) {
    ingoreObserver.value = false;
  }
};
</script>

<style lang="scss" scoped>
.container-root {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 0;
  box-sizing: border-box;
  overflow-x: hidden;
  background: v-bind(background);
  border-radius: v-bind(mainBorderRadius);
  .code-snippet {
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
  }
}
</style>
