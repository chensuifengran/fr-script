<template>
  <div class="script-list-div">
    <!-- 导入同名的脚本弹窗 -->
    <el-dialog v-model="sameScriptMod.visible" title="脚本导入">
      <div>{{ sameScriptMod.content }}</div>
      <div>作为新脚本导入：</div>
      <div>此选项会在脚本列表新增一项脚本，该脚本无法继承同名脚本配置(id不一致)</div>
      <div>更新同名脚本：</div>
      <div>此选项会将新脚本内容覆盖掉同名脚本，该脚本可以继承同名脚本配置(id一致)</div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="sameScriptMod.newImport">作为新脚本导入</el-button>
          <el-button @click="sameScriptMod.updateImport">更新同名脚本</el-button>
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
    <el-affix target=".script-list-div">
      <div class="header">
        <span style="font-size: 18px">脚本列表</span>
        <div class="header-right">
          <el-input
            class="input"
            v-model="search"
            clearable
            placeholder="搜索脚本名称或备注"
          />
          <el-button-group>
            <el-button @click="imoprtScript">导入</el-button>
            <el-button type="primary" @click="onAddItem">新建</el-button>
          </el-button-group>
        </div>
      </div>
    </el-affix>

    <div class="list" v-infinite-scroll="load" :infinite-scroll-distance="40">
      <ScriptListItem
        v-for="item in lazyList"
        :key="item.id"
        :id="item.id"
        @editorScriptFile="editorScriptFile"
        @openFile="openFile"
        @setScript="setScript"
        @runScript="runScript"
        @deleteScript="deleteScript"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { invoke } from "@tauri-apps/api";
import { nanoid } from "nanoid";
import { storeToRefs } from "pinia";
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
const loadCount = ref(0);

const load = () => {
  if (loadCount.value < searchList.value.length) {
    loadCount.value = Math.min(loadCount.value + 3, searchList.value.length);
  }
};

const lazyList = computed(() => {
  return searchList.value.slice(0, loadCount.value);
});

const sameScriptMod = reactive({
  visible: false,
  content: "",
  newImport: () => {},
  updateImport: () => {},
});
const deleteScriptDialog = ref(false);
const deleteScript = (index: number) => {
  deleteConfirm = () => {
    scriptList.value.splice(index, 1);
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

  if (scriptList.value[index].id === openId!.value) {
    //解决编辑器特殊场景下编辑脚本不会加载脚本
    openId!.value = "-1";
  }
  const t = setTimeout(async () => {
    openId!.value = scriptList.value[index].id;
    curScriptDir.value = await pathUtils.resolve(scriptList.value[index].savePath, "../");
    clearTimeout(t);
  }, 100);
  asideBarPos.value = "absolute";
};
const openFile = async (index: number) => {
  const path = scriptList.value[index].savePath;
  try {
    await ElMessageBox.confirm(
      "文件夹：打开脚本所在目录文件夹\nvscode：尝试使用vscode打开脚本文件",
      "请选择打开方式",
      {
        confirmButtonText: "vscode",
        cancelButtonText: "文件夹",
        type: "info",
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
          loadCount.value++;
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

const runScript = (index: number) => {
  openId!.value = scriptList.value[index].id;
  //路由跳转到运行器
  router.replace("/script/run");
};

const setScript = (index: number) => {
  openId!.value = scriptList.value[index].id;
  //路由跳转到设置
  router.replace("/script/setting");
};

const search = ref("");

const searchList = computed(() => {
  if (search.value === "") {
    return scriptList.value;
  } else {
    return scriptList.value.filter(
      (i) =>
        i.name.toLowerCase().includes(search.value.toLowerCase()) ||
        i.description.toLowerCase().includes(search.value.toLowerCase())
    );
  }
});
const appBackground = inject<globalThis.ComputedRef<"#000" | "#fff">>("appBackground");
</script>

<style lang="scss" scoped>
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
