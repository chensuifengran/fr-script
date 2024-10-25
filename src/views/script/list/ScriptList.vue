<template>
  <div class="script-list-div">
    <!-- 导入同名的脚本弹窗 -->
    <el-dialog v-model="sameScriptMod.visible" title="脚本导入">
      <div>{{ sameScriptMod.content }}</div>
      <div>作为新脚本导入：</div>
      <div>
        此选项会在脚本列表新增一项脚本，该脚本无法继承同名脚本配置(id不一致)
      </div>
      <div>更新同名脚本：</div>
      <div>
        此选项会将新脚本内容覆盖掉同名脚本，该脚本可以继承同名脚本配置(id一致)
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="sameScriptMod.newImport">作为新脚本导入</el-button>
          <el-button @click="sameScriptMod.updateImport"
            >更新同名脚本</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 删除脚本弹窗 -->
    <el-dialog v-model="deleteScriptDialog" title="删除脚本">
      <div>确定要删除该脚本吗?</div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteScriptDialog = false">取消</el-button>
          <el-button type="danger" @click="deleteConfirm">删除</el-button>
        </span>
      </template>
    </el-dialog>
    <div class="header" ref="headerRef">
      <span style="font-size: 18px">脚本列表</span>
      <div class="header-right">
        <el-input
          class="input"
          id="search_script_input"
          v-model="searchInfo.content"
          clearable
          placeholder="搜索脚本名称或备注"
        />
        <el-button-group>
          <el-button @click="imoprtScript">导入</el-button>
          <el-button id="new_script_btn" type="primary" @click="onAddItem"
            >新建</el-button
          >
        </el-button-group>
      </div>
    </div>

    <div class="list">
      <el-empty
        v-if="!isPlay && scriptList.length === 0"
        description="暂无脚本"
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
        <ScriptListItem
          v-for="item in showList"
          :key="item.id"
          :id="item.id"
          @editorScriptFile="editorScriptFile"
          :show-hover="showItemHover"
          @openFile="openFile"
          @setScript="setScript"
          @runScript="runScript"
          @deleteScript="deleteScript"
        />
      </VueDraggable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { invoke } from "@tauri-apps/api/core";
import { templateRef } from "@vueuse/core";
import { nanoid } from "nanoid";
import { storeToRefs } from "pinia";
import { UseDraggableReturn, VueDraggable } from "vue-draggable-plus";
const headerRef = templateRef<HTMLElement>("headerRef");
const isPlay = IS_PLAYGROUND_ENV;
const el = ref<UseDraggableReturn>();
let deleteConfirm: () => void = () => {};
const listStore = useListStore();
const { scriptList } = storeToRefs(listStore);
const {
  openId,
  curScriptDir,
  preloadPath,
  preloadText,
  contentTransform,
  asideBarPos,
} = useScriptInfo();
const showItemHover = ref(true);
const { appBackground } = useAppTheme();
const sameScriptMod = reactive({
  visible: false,
  content: "",
  newImport: () => {},
  updateImport: () => {},
});
const onStart = () => {
  showItemHover.value = false;
};
const onEnd = () => {
  showItemHover.value = true;
};
const deleteScriptDialog = ref(false);
const deleteScript = (index: number) => {
  deleteConfirm = () => {
    if (IS_PLAYGROUND_ENV) {
      //playground环境
      usePlayMock().mockScriptList.value.splice(index, 1);
    } else {
      scriptList.value.splice(index, 1);
    }
    ElNotification({
      title: "提示",
      message: "删除成功",
      type: "success",
      position: "bottom-right",
    });
    deleteScriptDialog.value = false;
  };
  deleteScriptDialog.value = true;
};
const editorScriptFile = (index: number) => {
  contentTransform.value = "translateX(-100%)";
  //路由跳转到编辑器
  router.replace("/script/editor");
  let id = scriptList.value[index]?.id;
  let dir = "";
  if (IS_PLAYGROUND_ENV) {
    //playground环境
    id = usePlayMock().mockScriptList.value[index]?.id;
    dir = `E:\\playground`;
  }
  if (id === openId!.value) {
    //解决编辑器特殊场景下编辑脚本不会加载脚本
    openId!.value = "-1";
  }
  const t = setTimeout(async () => {
    openId!.value = id;
    curScriptDir.value =
      dir || (await pathUtils.resolve(scriptList.value[index].savePath, "../"));
    clearTimeout(t);
  }, 100);
  asideBarPos.value = "absolute";
};
const openFile = async (index: number) => {
  if (IS_PLAYGROUND_ENV) {
    //playground环境
    ElNotification({
      title: "提示",
      message: "playground环境不支持打开文件",
      type: "warning",
      position: "bottom-right",
    });
    return;
  }
  const path = scriptList.value[index].savePath;
  try {
    await ElMessageBox.confirm(
      "在文件管理器显示并选中 或者 尝试使用vscode打开脚本文件",
      "请选择打开方式",
      {
        confirmButtonText: "vscode",
        cancelButtonText: "文件管理器",
        distinguishCancelAndClose: true,
      }
    );
    execCommand.run(`code ${path}`);
  } catch (error: any) {
    if (error === "cancel") {
      invoke("open_file_explorer", { path });
    }
  }
};

const onAddItem = () => {
  const { tourInfo } = useTour();
  if (IS_PLAYGROUND_ENV) {
    const { mockScriptList } = usePlayMock();
    if (tourInfo.scriptList.touring && tourInfo.scriptList.step === 2) {
      mockScriptList.value.push({
        id: DEMO_SCRIPT_ID,
        name: "演示脚本",
        savePath: "内部存储",
        version: "v1.2",
        description: "对脚本交互表单的渲染效果进行展示",
        setting: {
          autoImportLastRunConfig: true,
          targetAdbDevice: "",
          targetApp: "",
          autoStartTargetApp: false,
          excludeDevice: [],
        },
        content: DEMO_SCRIPT_TEMPLATE,
      });
      tourInfo.scriptList.preventNext = false;
      if (!tourInfo.scriptList.doneSteps.includes(tourInfo.scriptList.step)) {
        tourInfo.scriptList.doneSteps.push(tourInfo.scriptList.step);
      }
      tourInfo.scriptList.step++;
      return;
    }
    const id = nanoid();
    const version = "v1." + Math.floor(Math.random() * 10);
    mockScriptList.value.push({
      id,
      savePath: `内部存储`,
      name: id,
      version,
      description: "playground环境测试脚本",
      setting: {
        autoImportLastRunConfig: true,
        targetAdbDevice: "",
        excludeDevice: [],
        targetApp: "",
        autoStartTargetApp: false,
      },
      content: SCRIPT_TEMPLATE(id, version, "playground环境测试脚本"),
    });
    ElNotification({
      title: "提示",
      message: "创建成功",
      type: "success",
      position: "bottom-right",
    });
    openId!.value = id;
    //路由跳转到编辑器
    router.replace({
      path: "/script/editor",
    });
    contentTransform.value = "translateX(-100%)";
    asideBarPos.value = "absolute";
    return;
  } else {
    if (tourInfo.scriptList.touring && tourInfo.scriptList.step === 2) {
      scriptList.value.push({
        id: DEMO_SCRIPT_ID,
        name: "演示脚本",
        savePath: "内部存储",
        version: "v1.2",
        description: "对脚本交互表单的渲染效果进行展示",
        setting: {
          autoImportLastRunConfig: true,
          targetAdbDevice: "",
          targetApp: "",
          autoStartTargetApp: false,
          excludeDevice: [],
        },
      });
      tourInfo.scriptList.preventNext = false;
      if (!tourInfo.scriptList.doneSteps.includes(tourInfo.scriptList.step)) {
        tourInfo.scriptList.doneSteps.push(tourInfo.scriptList.step);
      }
      tourInfo.scriptList.step++;
      return;
    }
  }
  openId!.value = "-1";
  //路由跳转到编辑器
  router.replace({
    path: "/script/editor",
  });
  contentTransform.value = "translateX(-100%)";
  asideBarPos.value = "absolute";
};
const checkDeclare = (editorValue: string) => {
  const v = editorValue;
  if (v.indexOf(" */") === -1) {
    return false;
  } else {
    const targetStrPosition = v.indexOf(" */") + 3;
    const targetStr = editorValue.substring(0, targetStrPosition);
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
      return false;
    } else {
      return dm;
    }
  }
};
const imoprtScript = async () => {
  if (IS_PLAYGROUND_ENV) {
    //playground环境
    const id = nanoid();
    const version = "v1." + Math.floor(Math.random() * 10);
    usePlayMock().mockScriptList.value.push({
      id,
      savePath: `内部存储`,
      name: id,
      version,
      description: "playground环境测试脚本",
      setting: {
        autoImportLastRunConfig: true,
        targetAdbDevice: "",
        excludeDevice: [],
        targetApp: "",
        autoStartTargetApp: false,
      },
      content: SCRIPT_TEMPLATE(id, version, "playground环境测试脚本"),
    });
    ElNotification({
      title: "提示",
      message: "导入成功",
      type: "success",
      position: "bottom-right",
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
      if (scriptList.value.find((i) => i.savePath === filePath) !== undefined) {
        //该文件已经导入
        ElNotification({
          title: "提示",
          message: "该文件已经导入",
          type: "warning",
          position: "bottom-right",
        });
        return;
      }
      const cd = checkDeclare(originData);
      if (cd !== false) {
        //该文件有声明,检查是否有同名脚本
        const sameScript = scriptList.value.find((i) => i.name === cd.name);
        if (sameScript !== undefined) {
          //有同名脚本
          sameScriptMod.visible = true;
          sameScriptMod.content = "检测到同名脚本,请选择导入方式 ";
          sameScriptMod.newImport = () => {
            const id = nanoid();
            scriptList.value.push({
              id,
              savePath: filePath,
              name: cd.name,
              version: cd.version,
              description: cd.description,
              setting: {
                autoImportLastRunConfig: false,
                targetAdbDevice: "",
                excludeDevice: [],
                targetApp: "",
                autoStartTargetApp: false,
              },
            });
            ElNotification({
              title: "提示",
              message: "导入成功",
              type: "success",
              position: "bottom-right",
            });
            sameScriptMod.visible = false;
          };
          sameScriptMod.updateImport = () => {
            try {
              fsUtils.writeFile(sameScript.savePath, originData);
              sameScript.name = cd.name;
              sameScript.version = cd.version;
              sameScript.description = cd.description;
              ElNotification({
                title: "提示",
                message: "更新导入成功",
                type: "success",
                position: "bottom-right",
              });
              sameScriptMod.visible = false;
            } catch (error) {
              console.error(error);
              ElNotification({
                title: "提示",
                message: "更新导入失败",
                type: "error",
                position: "bottom-right",
              });
            }
          };
        } else {
          //无同名脚本
          const id = nanoid();
          scriptList.value.push({
            id,
            savePath: filePath,
            name: cd.name,
            version: cd.version,
            description: cd.description,
            setting: {
              autoImportLastRunConfig: false,
              targetAdbDevice: "",
              excludeDevice: [],
              targetApp: "",
              autoStartTargetApp: false,
            },
          });
          ElNotification({
            title: "提示",
            message: "导入成功",
            type: "success",
            position: "bottom-right",
          });
        }
      } else {
        //该文件并无声明
        onAddItem();
        preloadText.value = originData;
        preloadPath.value = filePath;
      }
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

const runScript = async (index: number) => {
  if (IS_PLAYGROUND_ENV) {
    //playground环境
    openId!.value = usePlayMock().mockScriptList.value[index].id;
  } else {
    openId!.value = scriptList.value[index].id;
  }
  //路由跳转到运行器
  router.replace("/script/run");
};

const setScript = (index: number) => {
  if (IS_PLAYGROUND_ENV) {
    //playground环境
    openId!.value = usePlayMock().mockScriptList.value[index].id;
  } else {
    openId!.value = scriptList.value[index].id;
  }
  //路由跳转到设置
  router.replace("/script/setting");
};

const { trueSearch, searchInfo, ingoreObserver } = useAutoTitleBar();

const disableSort = computed(() => {
  return trueSearch.value !== "";
});

const showList = computed({
  get: () => {
    const value = trueSearch.value;
    if (value === "") {
      if (IS_PLAYGROUND_ENV) {
        //playground环境
        return usePlayMock().mockScriptList.value;
      }
      return scriptList.value;
    } else {
      if (IS_PLAYGROUND_ENV) {
        return usePlayMock().mockScriptList.value.filter(
          (i) =>
            i.name.toLowerCase().includes(value.toLowerCase()) ||
            i.description.toLowerCase().includes(value.toLowerCase())
        );
      }
      return scriptList.value.filter(
        (i) =>
          i.name.toLowerCase().includes(value.toLowerCase()) ||
          i.description.toLowerCase().includes(value.toLowerCase())
      );
    }
  },
  set: (v) => {
    if (IS_PLAYGROUND_ENV) {
      usePlayMock().mockScriptList.value = v;
      return;
    }
    scriptList.value = v;
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
  ingoreObserver.value = true;
  searchInfo.show = false;
  searchInfo.target = SearchTarget.None;
  if (observer && headerRef.value) {
    observer.unobserve(headerRef.value);
  }
});
onMounted(async () => {
  invokeBaseApi.closeSplashscreen();
  observer = new IntersectionObserver(observerCallback, {});
  if (headerRef.value) {
    observer.observe(headerRef.value);
  }
  searchInfo.target = SearchTarget.ScriptList;
  await nextTick();
  const { controlDeviceInfo } = useControl();
  if (controlDeviceInfo.willRunScriptId) {
    const index = (
      IS_PLAYGROUND_ENV ? usePlayMock().mockScriptList.value : scriptList.value
    ).findIndex((i) => i.id === controlDeviceInfo.willRunScriptId);
    if (index !== -1) {
      runScript(index);
    }
  }
});
</script>

<style lang="scss" scoped>
.ghost {
  opacity: 0.9;
}

.script-list-div {
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
        width: 200px;
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
</style>
<style lang="scss">
.script-list-div {
  .el-affix {
    width: 100%;
  }
}
</style>
