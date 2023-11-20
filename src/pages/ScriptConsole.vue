<template>
  <div class="console-main">
    <el-empty description="开发中..." />
    <!-- <KeepAlive :include="['ScriptList', 'AsyncScriptRunConsole', 'AsyncCodeEditor']">
      <div class="script-console-div" v-if="curShow === 'index'">
        <ScriptList />
      </div>
      <div v-else-if="curShow === 'console'" class="script-console-div">
        <AsyncScriptRunConsole />
      </div>
      <div v-else-if="curShow === 'editor'" class="script-console-div">
        <AsyncCodeEditor />
      </div>
      <div v-else-if="curShow === 'scriptSet'" class="script-console-div">
        <AsyncScriptSetting />
      </div>
    </KeepAlive> -->
  </div>
</template>

<script setup lang="ts">
// import Loading from "@renderer/components/Loading.vue";
// import { useScriptStore } from "@renderer/store/scriptStore";
// import { SCRIPT_TEMPLATE } from "@renderer/utils/constantUtils";
// const AsyncScriptSetting = defineAsyncComponent({
//   loader: async () => {
//     // 可以返回一个promise
//     return import("@renderer/components/ScriptSetting.vue"); // 正常返回
//   },
//   loadingComponent: Loading, // SomeComponent未加载完成时 显示loading组件
// });
// const AsyncScriptRunConsole = defineAsyncComponent({
//   loader: async () => {
//     // 可以返回一个promise
//     return import("@renderer/components/ScriptRunConsole.vue"); // 正常返回
//   },
// });
// const AsyncCodeEditor = defineAsyncComponent({
//   loader: async () => {
//     // 可以返回一个promise
//     return import("@renderer/components/CodeEditor.vue"); // 正常返回
//   },
//   loadingComponent: Loading, // SomeComponent未加载完成时 显示loading组件
// });
// const path = require("path");

// const scriptStore = useScriptStore();

// const tempEditorValue = ref("");
// provide("tempEditorValue", tempEditorValue);
// const preloadText = ref(SCRIPT_TEMPLATE);
// provide("preloadText", preloadText);
// const preloadPath = ref("");
// provide("preloadPath", preloadPath);
// const curShow = ref<"index" | "editor" | "console" | "scriptSet">("index");
// watchEffect(() => {
//   if (curShow.value !== "index") {
//     if (openId.value !== "-1") {
//       scriptStore.curScriptDir = path.resolve(
//         scriptStore.scriptList.find((i) => i.id === openId.value)?.savePath,
//         "../"
//       );
//     } else {
//       scriptStore.curScriptDir = "";
//     }
//   }
// });
// const openId = ref("-1");
// provide("curShow", curShow);
// provide("openId", openId);

// const checkDU = inject("checkDU") as (isAuto?: boolean) => Promise<void>;
// onMounted(async () => {
//   await checkDU();
// });
</script>

<style lang="scss" scoped>
.console-main {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 20px;
  padding-bottom: 0;
  padding-top: 5px;
  box-sizing: border-box;
  overflow-x: hidden;
  .script-console-div {
    width: 100%;
    height: 100%;
    position: relative;
    overflow-x: hidden;
  }
}
</style>
<style lang="scss"></style>
