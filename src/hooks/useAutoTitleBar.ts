export enum SearchTarget {
  None = "",
  ScriptList = "scriptList",
  CodeSnippetList = "codeSnippetList",
}
const info = reactive({
  title: "风染脚本",
  showContentType: "app-name",
  apiTest: {
    searchValue: "",
    openOutput: false,
  },
});
const windowInnerWidth = ref(window.innerWidth || 0);
let syncTimer: any = null;
const syncWindowInnerWidth = (width: number) => {
  syncTimer && clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    windowInnerWidth.value = width;
    clearTimeout(syncTimer);
  }, 100);
};
const clickMinimize = ref(false);
const needSyncLastData = ref(false);
const searchInfo = reactive<{
  content: string;
  show: boolean;
  target: SearchTarget;
}>({
  content: "",
  show: false,
  target: SearchTarget.None,
});
const trueSearch = ref("");
let searchTimer: NodeJS.Timeout | undefined = undefined;
watch(
  () => searchInfo.content,
  () => {
    searchTimer && clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      trueSearch.value = searchInfo.content;
      clearTimeout(searchTimer);
    }, 300);
  }
);
const ingoreObserver = ref(true);
export const useAutoTitleBar = () => {
  return {
    info,
    windowInnerWidth,
    syncWindowInnerWidth,
    clickMinimize,
    needSyncLastData,
    searchInfo,
    trueSearch,
    ingoreObserver
  };
};
