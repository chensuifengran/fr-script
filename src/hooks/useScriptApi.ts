import { storeToRefs } from "pinia";
import { appWindow, WebviewWindow } from "@tauri-apps/api/window";
//拷贝一份默认配置
let curRendererList: RendererList[] = [];
const importLastRunConfig = async (rendererList?: RendererList[]) => {
  if (!rendererList) {
    const { rendererList: r } = useListStore();
    rendererList = r;
  }
  const scriptConfig = rendererList.find(
    (i: RendererList) => i.groupLabel === "*脚本设置"
  );
  const mergeConfig = scriptConfig?.checkList.find(
    (i) => i.label === "导入上次运行配置"
  )?.checked;
  if (mergeConfig) {
    await nextTick();
    const defaultObj: RendererList[] = JSON.parse(JSON.stringify(rendererList));
    curRendererList = JSON.parse(JSON.stringify(rendererList));
    const r = localStorage.getItem(
      window[CORE_NAMESPACES].getScriptId!() + "-rendererList"
    );
    if (r) {
      //合并配置
      const targetObj: RendererList[] = JSON.parse(r);
      for (let i = 0; i < defaultObj.length; i++) {
        const defaultItem = defaultObj[i];
        const targetItem = targetObj.find(
          (item) => item.groupLabel === defaultItem.groupLabel
        );
        if (targetItem) {
          //覆盖defaultItem的enable
          defaultItem.enable = targetItem.enable;
          //判断targetItem的selectList[index].value是否存在于defaultItem的selectList[index].options中
          for (let j = 0; j < defaultItem.selectList.length; j++) {
            const defaultSelectItem = defaultItem.selectList[j];
            const targetSelectItem = targetItem.selectList.find(
              (item) => item.label === defaultSelectItem.label
            );
            if (targetSelectItem) {
              let opts: (string | number | boolean)[] = [];
              let newVal;
              if (targetSelectItem.group) {
                opts = targetSelectItem.options.flatMap((i) =>
                  i.options.map((j) => {
                    if (typeof j === "object") {
                      return j.value;
                    } else {
                      return j;
                    }
                  })
                );
              } else {
                opts = targetSelectItem.options.map((i) => {
                  if (typeof i === "object") {
                    return i.value;
                  } else {
                    return i;
                  }
                });
              }
              if (targetSelectItem.multiple) {
                if (Array.isArray(targetSelectItem.value)) {
                  newVal = targetSelectItem.value.filter((i) =>
                    opts.includes(i)
                  );
                } else {
                  console.warn(
                    "表单结构发生变化,跳过导入本项的值",
                    JSON.stringify(targetSelectItem)
                  );
                }
              } else {
                if (!Array.isArray(targetSelectItem.value)) {
                  newVal = opts.includes(targetSelectItem.value)
                    ? targetSelectItem.value
                    : defaultSelectItem.value;
                } else {
                  console.warn(
                    "表单结构发生变化,跳过导入本项的值",
                    JSON.stringify(targetSelectItem)
                  );
                }
              }
              defaultSelectItem.value = newVal as
                | string
                | number
                | boolean
                | number[]
                | string[]
                | boolean[];
            }
          }
          //覆盖defaultItem的checkList[index]的checked
          for (let j = 0; j < defaultItem.checkList.length; j++) {
            const defaultCheckItem = defaultItem.checkList[j];
            const targetCheckItem = targetItem.checkList.find(
              (item) => item.label === defaultCheckItem.label
            );
            if (targetCheckItem) {
              defaultCheckItem.checked = targetCheckItem.checked;
            }
          }
          //覆盖defaultItem的inputList[index]的value
          for (let j = 0; j < defaultItem.inputList.length; j++) {
            const defaultInputItem = defaultItem.inputList[j];
            const targetInputItem = targetItem.inputList.find(
              (item) => item.label === defaultInputItem.label
            );
            if (targetInputItem) {
              defaultInputItem.value = targetInputItem.value;
            }
          }
        }
      }
      defaultObj.find((i) => {
        if (i.groupLabel === "*脚本设置") {
          i.checkList.find((i) => i.label === "导入上次运行配置")!.checked =
            true;
          return;
        }
      });
      rendererList.splice(0, rendererList.length, ...defaultObj);
    }
    ElNotification.closeAll();
    ElNotification({
      title: "配置导入完成",
      type: "success",
      position: "bottom-right",
    });
  } else {
    const { openId } = useScriptInfo();
    if (openId.value === "-1") {
      return;
    }
    ElNotification.closeAll();
    ElNotification({
      title: "取消配置导入",
      type: "info",
      position: "bottom-right",
    });
    curRendererList.find((i) => {
      if (i.groupLabel === "*脚本设置") {
        i.checkList.find((i) => i.label === "导入上次运行配置")!.checked =
          false;
        return;
      }
    });
    if (curRendererList.length) {
      rendererList.splice(0, rendererList.length, ...curRendererList);
    } else {
      rendererList.splice(0, rendererList.length, ...rendererList);
    }
  }
};

const updateWindowRendererList = () => {
  const { rendererList } = useListStore();
  window[CORE_NAMESPACES].rendererList = rendererList;
};

const replaceRendererList = (newRendererList: RendererList[]) => {
  const { rendererList } = useListStore();
  rendererList.splice(0, rendererList.length, ...newRendererList);
  updateWindowRendererList();
};

//给渲染列表动态添加元素
const pushElement = (
  elem: BuildFormItems,
  //更新window对象中的rendererList
  updateRendererList: boolean = true
) => {
  const { rendererList } = useListStore();

  const idx = rendererList.findIndex(
    (g) => g.groupLabel === elem.targetGroupLabel
  );
  if (idx === -1) {
    //目标组不存在则新增目标组
    const group: any = {
      groupLabel: elem.targetGroupLabel,
      enable: elem.enable === undefined ? true : elem.enable,
      checkList: [],
      selectList: [],
      inputList: [],
      pickerList: [],
    };
    group[elem.type + "List"] = [elem];
    rendererList.push(group);
  } else {
    (rendererList[idx] as any)[elem.type + "List"].push(elem);
  }
  updateRendererList && updateWindowRendererList();
};
//渲染UI表单
const buildForm = (buildFormList: BuildFormItems[]) => {
  for (let i = 0; i < buildFormList.length; i++) {
    const item = buildFormList[i];
    pushElement(item, false);
  }
  updateWindowRendererList();
};

const allTask = ref(1);
const curTask = ref(0);
const curTaskName = ref("");
const taskStatus = ref<"success" | "warning" | "exception" | "">("");
const getAllTask = () => allTask.value;
const getCurTask = () => curTask.value;
const getCurTaskName = () => curTaskName.value;
const getTaskStatus = () => taskStatus.value;

const setAllTask = (num: number) => {
  allTask.value = num;
};
const setCurTask = (num: number) => {
  curTask.value = num;
};
const nextTask = (name: string) => {
  if (curTask.value < allTask.value) {
    curTask.value++;
  }
  curTaskName.value = name;
};
const setTaskEndStatus = (
  status: "success" | "warning" | "exception" | "",
  endMessage?: string
) => {
  if (status === "") {
    allTask.value = 1;
    curTask.value = 0;
    taskStatus.value = "";
    curTaskName.value = "";
  } else {
    curTask.value = allTask.value;
    taskStatus.value = status;
    curTaskName.value = endMessage || "";
  }
};

const getCustomizeForm = async () => {
  const rendererForm = await new Promise<RendererList[]>((resolve) => {
    let signal =
      window[CORE_NAMESPACES].startScriptSignal &&
      window[CORE_NAMESPACES].startScriptSignal.signal;
    if (signal && signal.aborted) {
      //脚本调用getCustomizeForm时，必须保证signal未被中止，中止说明脚本重新被运行，需要重新创建一个signal
      window[CORE_NAMESPACES].startScriptSignal = new AbortController();
      signal = window[CORE_NAMESPACES].startScriptSignal.signal;
    }
    const signalHandle = () => {
      window[CORE_NAMESPACES].abortSignalInScript = undefined;
      signal!.removeEventListener("abort", signalHandle);
      //保存此次运行选择的配置选项
      localStorage.setItem(
        window[CORE_NAMESPACES].getScriptId!() + "-rendererList",
        JSON.stringify(window[CORE_NAMESPACES].rendererList)
      );
      resolve(window[CORE_NAMESPACES].rendererList);
    };
    signal!.addEventListener("abort", signalHandle);
  });
  return new RFormUtil(rendererForm);
};
const abortSignalInScript = ref<AbortController | undefined>();
const getWillRunScript = (runId: string, script: string) => {
  const { genBuiltInApi } = useCore();
  const buildApiScript = genBuiltInApi(runId);
  const scriptTemplate = `
    try{
      with(window['${CORE_NAMESPACES}']){
        ${buildApiScript + "\n"}
        changeScriptRunState(true);
        replaceRendererList([]);
        pushElement({
          targetGroupLabel: "*脚本设置",
          label: "导入上次运行配置",
          checked: false,
          type: "check",
        });
        const signal = abortSignalInScript && abortSignalInScript.signal;
        const signalHandle = ()=>{
          const error = new DOMException('任务被手动终止');
          try{changeScriptRunState && changeScriptRunState('stop');}catch(e){console.warn(e);}
          abortSignalInScript = undefined;
          signal.removeEventListener('abort',signalHandle);
          isStop = true;
        }
        signal.addEventListener('abort',signalHandle);
        const evalFunction = async()=>{
          ${script}
          main && await main();
          removeIntervals();
          try{changeScriptRunState && changeScriptRunState(false, '${runId}');}catch(e){console.error(e);}
          console.log('script run done!');
        }
        evalFunction();
      }
    }catch(e){
      console.error(e);
    }
  `;
  return scriptTemplate;
};
const setIntervals: NodeJS.Timeout[] = [];
const _setInterval = (callback: () => void, ms?: number | undefined) => {
  const timeout = setInterval(() => {
    try {
      const { isStop } = window[CORE_NAMESPACES];
      if (isStop) {
        _clearInterval(timeout);
        return;
      }
      callback();
    } catch (e) {
      console.error(e);
    }
  }, ms);
  setIntervals.push(timeout);
  return timeout;
};
const _clearInterval = (timeout: NodeJS.Timeout) => {
  clearInterval(timeout);
  setIntervals.splice(setIntervals.indexOf(timeout), 1);
};
let removeTimer: NodeJS.Timeout | null = null;
const removeIntervals = () => {
  removeTimer && clearTimeout(removeTimer);
  removeTimer = setTimeout(() => {
    setIntervals.forEach((i) => {
      clearInterval(i);
    });
    setIntervals.splice(0, setIntervals.length);
    console.log("已清除所有定时器");
  }, 300);
};
export const getFileInfo = (
  type: "id" | "savePath" | "name" | "version" | "description"
) => {
  const listStore = useListStore();
  const { scriptList } = storeToRefs(listStore);
  const { openId } = useScriptInfo();
  const target = scriptList.value.find((s) => s.id === openId!.value)!;
  switch (type) {
    case "id":
      return target?.id;
    case "name":
      return target?.name;
    case "description":
      return target?.description;
    case "savePath":
      return target?.savePath;
    case "version":
      return target?.version;
    default:
      console.error(type);
      return type;
  }
};
export type TaskRunStatus = "ready" | "done" | "running";
const taskRunStatus = ref<TaskRunStatus>("ready");
const { notify } = eventUtil;
const getScriptId = () => getFileInfo("id");
let endBeforeCompletion = false;
const setEndBeforeCompletion = (status: boolean) => {
  endBeforeCompletion = status;
};

const hideWindow = ref(true);

const name = computed(() => {
  return getFileInfo("name");
});
const version = computed(() => {
  return getFileInfo("version");
});
const savePath = computed(() => {
  return getFileInfo("savePath");
});
const notDelApi = [
  "changeScriptRunState",
  "isStop",
  "removeIntervals",
  "log",
  "setInterval",
  "getScriptId",
];
const changeScriptRunState = (state: boolean | "stop", taskId?: string) => {
  const { runningFnId } = useScriptRuntime();
  if (taskId && taskId !== runningFnId.value) {
    return;
  }
  if (state === "stop") {
    taskRunStatus.value = "done";
    window[CORE_NAMESPACES].removeIntervals &&
      window[CORE_NAMESPACES].removeIntervals();
    if (window[CORE_NAMESPACES]) {
      Object.keys(window[CORE_NAMESPACES]).forEach((key) => {
        if (notDelApi.includes(key)) {
          return;
        }
        //@ts-ignore
        delete window[CORE_NAMESPACES][key];
      });
    }
    if (hideWindow.value) {
      WebviewWindow.getByLabel("main")?.show();
      notify.done();
    }
  } else if (state) {
    // useLog().clearLogOutput();
    taskRunStatus.value = "ready";
    endBeforeCompletion = false;
  } else {
    if (endBeforeCompletion) {
      return;
    }
    taskRunStatus.value = "done";
    useBuiltInApi().Preludes.log("脚本执行完成", "success");
    setTaskEndStatus("success", "脚本执行完成");
    if (window[CORE_NAMESPACES]) {
      Object.keys(window[CORE_NAMESPACES]).forEach((key) => {
        if (notDelApi.includes(key)) {
          return;
        }
        //@ts-ignore
        delete window[CORE_NAMESPACES][key];
      });
    }
    //显示当前窗口
    if (hideWindow.value) {
      appWindow.show();
      appWindow.setFocus();
      notify.done();
    }
  }
};
export const useScriptApi = () => {
  const { openId } = useScriptInfo();
  const listStore = useListStore();
  const { scriptList } = storeToRefs(listStore);
  const _buildForm = (buildFormList: BuildFormItems[]) => {
    buildForm(buildFormList);
    if (openId.value !== "-1") {
      const target = scriptList.value.find((i) => i.id === openId.value);
      if (!target?.setting.autoImportLastRunConfig) {
        return;
      } else if (target.setting.autoImportLastRunConfig) {
        const scriptConfig = window[CORE_NAMESPACES].rendererList?.find(
          (i) => i.groupLabel === "*脚本设置"
        );
        if (scriptConfig) {
          const importLastRunConfigItem = scriptConfig.checkList.find(
            (i) => i.label === "导入上次运行配置"
          );
          if (importLastRunConfigItem) {
            importLastRunConfigItem.checked = true;
            importLastRunConfig();
          }
        }
      }
    }
  };
  return {
    importLastRunConfig,
    replaceRendererList,
    getWillRunScript,
    setEndBeforeCompletion,
    getEndBeforeCompletion: () => endBeforeCompletion,
    getFileInfo,
    buildForm: _buildForm,
  };
};

export const useScriptView = () => {
  return {
    taskRunStatus,
    name,
    version,
    hideWindow,
    savePath,
  };
};

/**
 * 脚本运行时的所有内置api,返回新增内置API后请
 * 前往../invokes/utilDeclareTypes.ts中添加类型声明，
 * 用于提供给编辑器进行代码提示。
 */
export const useBuiltInApi = () => {
  const { exportAllFn } = useCore();
  const { rendererList } = useListStore();
  const appGSStore = useAppGlobalSettings();
  const WORK_DIR = appGSStore.envSetting.workDir;
  const SCREEN_SHOT_DIR = pathUtils.resolve(
    appGSStore.envSetting.screenshotSavePath || "",
    "../"
  );
  const SCREEN_SHOT_PATH = appGSStore.envSetting.screenshotSavePath;
  const SCRIPT_ROOT_DIR = pathUtils.resolve(
    getFileInfo("savePath") || "",
    "../"
  );
  return {
    WORK_DIR,
    copyText,
    readClipboardFirstText,
    SCREEN_SHOT_PATH,
    SCREEN_SHOT_DIR,
    __httpValue: "http://",
    SCRIPT_ROOT_DIR,
    isStop: false,
    SCRIPT_ID: getScriptId(),
    setAllTask,
    setCurTask,
    getAllTask,
    getCurTask,
    getCurTaskName,
    nextTask,
    getTaskStatus,
    setTaskEndStatus,
    getCustomizeForm,
    abortSignalInScript: abortSignalInScript.value,
    startScriptSignal: new AbortController(),
    setInterval: _setInterval,
    clearInterval: _clearInterval,
    removeIntervals,
    rendererList,
    getScriptId,
    changeScriptRunState,
    ...exportAllFn(),
    replaceRendererList,
    pushElement,
  };
};
