const openId = ref<string>("-1");
const tempEditorValue = ref("");
const preloadText = ref(SCRIPT_TEMPLATE);
const preloadPath = ref("");
const curScriptDir = ref("");
export const useScriptInfo = ()=>{
  return {
    openId,
    tempEditorValue,
    preloadText,
    preloadPath,
    curScriptDir
  }
}