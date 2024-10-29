import { storeToRefs } from "pinia";
import {
  getCurrentWebviewWindow,
  WebviewWindow,
} from "@tauri-apps/api/webviewWindow";
import { ScriptTarget, transpile } from "typescript";
//拷贝一份默认配置
let curRenderList: RenderGroup[] = [];
const importLastRunConfig = async (renderList?: RenderGroup[]) => {
  if (!renderList) {
    const { renderList: r } = useListStore();
    renderList = r;
  }
  const scriptConfig = renderList.find(
    (i: RenderGroup) => i.groupLabel === "*脚本设置"
  );
  const mergeConfig = scriptConfig?.checkList.find(
    (i) => i.label === "导入上次运行配置"
  )?.checked;
  if (mergeConfig) {
    await nextTick();
    scriptConfig!.checkList.find(
      (i) => i.label === "导入上次运行配置"
    )!.checked = false;
    const defaultObj: RenderGroup[] = JSON.parse(JSON.stringify(renderList));
    curRenderList = JSON.parse(JSON.stringify(renderList));
    const r = localStorage.getItem(
      window[CORE_NAMESPACES].getScriptId!() + "-renderList"
    );
    if (r) {
      //合并配置
      const targetObj: RenderGroup[] = JSON.parse(r);
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
            if (targetSelectItem && !targetSelectItem.segmented) {
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
            } else if (targetSelectItem && targetSelectItem.segmented) {
              const newOptionValues = targetSelectItem.options.map((o) => {
                if (o instanceof Object) {
                  return o.value;
                } else {
                  return o;
                }
              });
              if (
                defaultSelectItem.segmented &&
                newOptionValues.includes(defaultSelectItem.value)
              ) {
                defaultSelectItem.value = targetSelectItem.value;
              }
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
          //覆盖defaultItem的pickerList[index]的value
          for (let j = 0; j < defaultItem.pickerList.length; j++) {
            const defaultPickerItem = defaultItem.pickerList[j];
            const targetPickerItem = targetItem.pickerList.find(
              (item) => item.label === defaultPickerItem.label
            );
            if (targetPickerItem) {
              defaultPickerItem.value = targetPickerItem.value;
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
      renderList.splice(0, renderList.length, ...defaultObj);
    }
    scriptConfig!.checkList.find(
      (i) => i.label === "导入上次运行配置"
    )!.checked = true;
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
    curRenderList.find((i) => {
      if (i.groupLabel === "*脚本设置") {
        i.checkList.find((i) => i.label === "导入上次运行配置")!.checked =
          false;
        return;
      }
    });
    if (curRenderList.length) {
      renderList.splice(0, renderList.length, ...curRenderList);
    } else {
      renderList.splice(0, renderList.length, ...renderList);
    }
  }
};

const updateWindowRenderList = () => {
  const { renderList } = useListStore();
  setTimeout(() => {
    window[CORE_NAMESPACES].renderList = renderList;
  });
};

const replaceRenderList = (newRenderList: RenderGroup[]) => {
  const { renderList } = useListStore();
  renderList.splice(0, renderList.length, ...newRenderList);
  updateWindowRenderList();
};

//给渲染列表动态添加元素
const pushElement = (
  elem: BuildFormItems,
  //更新window对象中的rendererList
  updateRenderList: boolean = true
) => {
  const { renderList } = useListStore();

  const idx = renderList.findIndex(
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
    renderList.push(group);
  } else {
    (renderList[idx] as any)[elem.type + "List"].push(elem);
  }
  updateRenderList && updateWindowRenderList();
};
//渲染UI表单
const buildForm = (buildFormList: BuildFormItems[], transform?:boolean) => {
  for (let i = 0; i < buildFormList.length; i++) {
    const item = buildFormList[i];
    pushElement(item, false);
  }
  if(transform){
    const { renderList } = useListStore();
    const res = JSON.parse(JSON.stringify(renderList))
    return
  }
  updateWindowRenderList();
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
  const rendererForm = await new Promise<RenderGroup[]>((resolve) => {
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
        window[CORE_NAMESPACES].getScriptId!() + "-renderList",
        JSON.stringify(window[CORE_NAMESPACES].renderList)
      );
      resolve(window[CORE_NAMESPACES].renderList);
    };
    signal!.addEventListener("abort", signalHandle);
  });
  return new RFormUtil(rendererForm);
};
const abortSignalInScript = ref<AbortController | undefined>();
const getWillRunScript = (runId: string, script: string) => {
  const { genBuiltInApi } = useCore();
  const buildApiScript = genBuiltInApi(runId);
  const appGSStore = useAppGlobalSettings();
  const injectConstants = genInjectConstant(appGSStore);
  const scriptTemplate = `
    try{
      with(window['${CORE_NAMESPACES}']){
        ${buildApiScript + "\n"}
        changeScriptRunState(true);
        replaceRenderList([]);
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
          ${ENUM_CODE}
          ${injectConstants}
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
  return transpile(scriptTemplate, {
    target: ScriptTarget.ESNext,
    removeComments: true,
  });
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
  type: "id" | "savePath" | "name" | "version" | "description" | "content"
) => {
  const listStore = useListStore();
  const { scriptList } = storeToRefs(listStore);
  const { openId } = useScriptInfo();
  if (IS_PLAYGROUND_ENV) {
    return usePlayMock().mockScriptList.value.find(
      (s) => s.id === openId!.value
    )![type]!;
  }
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

const hideWindow = ref(!IS_PLAYGROUND_ENV);

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
    if (hideWindow.value && !IS_PLAYGROUND_ENV) {
      WebviewWindow.getByLabel("main")
        .then((w) => {
          w?.show();
        })
        .finally(notify.done);
    }
  } else if (state) {
    // useLog().clearLogOutput();
    taskRunStatus.value = "ready";
    endBeforeCompletion = false;
  } else {
    if (endBeforeCompletion) {
      return;
    }
    useBuiltInApi().Preludes.log("脚本执行完成", "success", undefined, true);
    setTaskEndStatus("success", "脚本执行完成");
    taskRunStatus.value = "done";
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
    if (hideWindow.value && !IS_PLAYGROUND_ENV) {
      const appWindow = getCurrentWebviewWindow();
      appWindow.show();
      appWindow.setFocus();
      notify.done();
    }
  }
};
export const useScriptApi = () => {
  const { openId } = useScriptInfo();
  const listStore = useListStore();
  const { scriptList, renderList } = storeToRefs(listStore);
  const _buildForm = (buildFormList: BuildFormItems[]) => {
    buildForm(buildFormList);
    if (openId.value !== "-1") {
      const target = (
        IS_PLAYGROUND_ENV ? usePlayMock().mockScriptList : scriptList
      ).value.find((i) => i.id === openId.value);
      if (!target?.setting.autoImportLastRunConfig) {
        return;
      } else if (target.setting.autoImportLastRunConfig) {
        const scriptConfig = window[CORE_NAMESPACES].renderList?.find(
          (i) => i.groupLabel === "*脚本设置"
        );
        if (scriptConfig) {
          const importLastRunConfigItem = scriptConfig.checkList.find(
            (i) => i.label === "导入上次运行配置"
          );
          if (importLastRunConfigItem) {
            importLastRunConfigItem.checked = true;
            renderList.value
              .find((i) => i.groupLabel === "*脚本设置")!
              .checkList.find((i) => i.label === "导入上次运行配置")!.checked =
              true;
            importLastRunConfig();
          }
        }
      }
    }
  };
  return {
    importLastRunConfig,
    replaceRenderList,
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
 * 脚本运行时的所有内置api,return的对象会被注入到脚本运行时的上下文中
 */
export const useBuiltInApi = () => {
  const { exportAllFn } = useCore();
  const { renderList } = useListStore();
  return {
    copyText,
    readClipboardFirstText,
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
    renderList,
    getScriptId,
    changeScriptRunState,
    ...exportAllFn(),
    replaceRenderList,
    pushElement,
  };
};
