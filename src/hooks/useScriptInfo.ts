const openId = ref<string>("-1");
const tempEditorValue = ref("");
const preloadText = ref(SCRIPT_TEMPLATE());
const preloadPath = ref("");
const curScriptDir = ref("");
const contentTransform = ref("translateX(0)");
const asideBarPos = ref("relative");
const testApiWinId = ref<number>(-1);
const isEditing = ref(false);
const fileInfo = reactive({
  originData: "",
  lastData: "",
  version: "",
  description: "",
  name: "未命名脚本",
  savePath: "",
  declare: false,
});
const { insertText } = useEditor();
const insertDeclare = () => {
  insertText(
    EDITOR_DOM_ID,
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
export const useScriptInfo = () => {
  return {
    openId,
    tempEditorValue,
    preloadText,
    preloadPath,
    curScriptDir,
    contentTransform,
    asideBarPos,
    testApiWinId,
    isEditing,
    fileInfo,
    declareMod,
    saveMod,
    autoSaveDialog,
  };
};
