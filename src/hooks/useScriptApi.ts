import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import * as monaco from "monaco-editor";
import { writeTextFile } from "@tauri-apps/api/fs";
const { exportAllFn, getInvokeApiFnProxyStrings } =
  useInvokeApiMethodsRegister();
let editor: monaco.editor.IStandaloneCodeEditor | null = null;
const buildTableForm = () => {
  return new TableForm();
};

//拷贝一份默认配置
let curRendererList: RendererList[] = [];
const importLastRunConfig = async (rendererList?:RendererList[]) => {
  if(!rendererList){
    const { rendererList:r } = useListStore();
    rendererList = r;
  }
  const scriptConfig = rendererList.find(
    (i: RendererList) => i.groupLabel === "*脚本设置"
  );
  const mergeConfig = scriptConfig?.checkList.find((i) => i.label === "导入上次运行配置")
    ?.checked;
  if (mergeConfig) {
    await nextTick();
    const defaultObj: RendererList[] = JSON.parse(JSON.stringify(rendererList));
    curRendererList = JSON.parse(JSON.stringify(rendererList));

    const r = localStorage.getItem(
      (window as any).runTimeApi.getScriptId!() + "-rendererList"
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
              const options = defaultSelectItem.options;
              if (options.includes(targetSelectItem.value)) {
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

          /*
            提取defaultItem的groupSelectList[index]中的所有选项分组的value,
            判断targetItem的groupSelectList[index].value,
            是否存在于提取出来的数组中
            存在则覆盖defaultItem的groupSelectList[index].value
            */
          const AllValues: string[] = [];
          for (let j = 0; j < defaultItem.groupSelectList.length; j++) {
            const defaultGroupSelectItem = defaultItem.groupSelectList[j];
            const targetGroupSelectItem = targetItem.groupSelectList.find(
              (item) => item.label === defaultGroupSelectItem.label
            );
            if (targetGroupSelectItem) {
              const options = defaultGroupSelectItem.options;
              for (let k = 0; k < options.length; k++) {
                const option = options[k];
                for (let l = 0; l < option.options.length; l++) {
                  const item = option.options[l];
                  AllValues.push(item.value);
                }
              }
              if (AllValues.includes(targetGroupSelectItem.value)) {
                defaultGroupSelectItem.value = targetGroupSelectItem.value;
              }
            }
          }

          /*
            提取defaultItem的multipleGroupSelectList[index]中的所有选项分组的value,
            判断targetItem的multipleGroupSelectList[index].value,
            是否存在于提取出来的数组中
            存在则覆盖defaultItem的multipleGroupSelectList[index].value
            */
          const AllMultipleValues: string[] = [];
          for (let j = 0; j < defaultItem.multipleGroupSelectList.length; j++) {
            const defaultMultipleGroupSelectItem = defaultItem.multipleGroupSelectList[j];
            const targetMultipleGroupSelectItem = targetItem.multipleGroupSelectList.find(
              (item) => item.label === defaultMultipleGroupSelectItem.label
            );
            if (targetMultipleGroupSelectItem) {
              const options = defaultMultipleGroupSelectItem.options;
              for (let k = 0; k < options.length; k++) {
                const option = options[k];
                for (let l = 0; l < option.options.length; l++) {
                  const item = option.options[l];
                  AllMultipleValues.push(item.value);
                }
              }
              const targetMultipleGroupSelectItemValue =
                targetMultipleGroupSelectItem.value;
              const newTargetMultipleGroupSelectItemValue: string[] = [];
              for (let k = 0; k < targetMultipleGroupSelectItemValue.length; k++) {
                const item = targetMultipleGroupSelectItemValue[k];
                if (AllMultipleValues.includes(item)) {
                  newTargetMultipleGroupSelectItemValue.push(item);
                }
              }
              defaultMultipleGroupSelectItem.value = newTargetMultipleGroupSelectItemValue;
            }
          }

          //拿到defaultItem的tableList[index]的inputProp所有的propLabel
          const AllTableInputPropLabel: string[] = [];
          for (let j = 0; j < defaultItem.tableList.length; j++) {
            const defaultTableItem = defaultItem.tableList[j];
            const targetTableItem = targetItem.tableList.find(
              (item) => item.label === defaultTableItem.label
            );
            if (targetTableItem) {
              const inputProp = defaultTableItem.inputProp;
              AllTableInputPropLabel.push(...inputProp.map((i) => i.propLabel));
              //判断targetTableItem的tableData的每一项的键是否存在于AllTableInputPropLabel中
              const tableData = targetTableItem.tableData;
              for (let k = 0; k < tableData.length; k++) {
                const item = tableData[k];
                for (const key in item) {
                  if (Object.prototype.hasOwnProperty.call(item, key)) {
                    if (!AllTableInputPropLabel.includes(key)) {
                      delete (item as any)[key];
                    }
                  }
                }
              }
              //覆盖defaultTableItem的tableData
              defaultTableItem.tableData = tableData;
            }
          }
        }
      }
      defaultObj.find((i) => {
        if (i.groupLabel === "*脚本设置") {
          i.checkList.find((i) => i.label === "导入上次运行配置")!.checked = true;
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
        i.checkList.find((i) => i.label === "导入上次运行配置")!.checked = false;
        return;
      }
    });
    if(curRendererList.length){
      rendererList.splice(0, rendererList.length, ...curRendererList);
    }else{
      rendererList.splice(0, rendererList.length, ...rendererList);
    }

  }
};
const addRendererListToWindow = () => {
  const { rendererList } = useListStore();
  //window对象没有rendererList属性时，添加rendererList属性
  //@ts-ignore
  if(!window["rendererList"]){
    //@ts-ignore
    window["rendererList"] = rendererList;
    console.log("rendererList属性已添加到window对象"); 
  }
};
const replaceRendererList = (newRendererList: RendererList[]) => {
  const { rendererList } = useListStore();
  rendererList.splice(0, rendererList.length, ...newRendererList);
  addRendererListToWindow();
};
//给渲染列表添加checkList类型元素
const pushElementToCheckList = (
  elem: {
    targetGroupLabel: string;
    label: string;
    checked: boolean;
    enable?: boolean;
  },
  pushTo: "rendererList" | "previewRendererList" = "rendererList"
) => {
  const { rendererList, previewRendererList } = useListStore();
  let rList = rendererList;
  if (pushTo === "previewRendererList") {
    rList = previewRendererList;
  }
  const idx = rList.findIndex((g) => g.groupLabel === elem.targetGroupLabel);
  if (idx === -1) {
    //目标组不存在则新增目标组
    rList.push({
      groupLabel: elem.targetGroupLabel,
      enable: elem.enable === undefined ? true : elem.enable,
      checkList: [
        {
          label: elem.label,
          checked: elem.checked,
        },
      ],
      groupSelectList: [],
      selectList: [],
      multipleGroupSelectList: [],
      tableList: [],
      inputList: [],
    });
  } else {
    rList[idx].checkList.push({
      label: elem.label,
      checked: elem.checked,
    });
  }
  pushTo === "rendererList" && addRendererListToWindow();
};
//给渲染列表添加inputList类型元素
const pushElementToInputList = (
  elem: {
    targetGroupLabel: string;
    label: string;
    value: string;
    enable?: boolean;
  },
  pushTo: "rendererList" | "previewRendererList" = "rendererList"
) => {
  const { rendererList, previewRendererList } = useListStore();
  let rList = rendererList;
  if (pushTo === "previewRendererList") {
    rList = previewRendererList;
  }
  const idx = rList.findIndex((g) => g.groupLabel === elem.targetGroupLabel);
  if (idx === -1) {
    //目标组不存在则新增目标组
    rList.push({
      groupLabel: elem.targetGroupLabel,
      enable: elem.enable === undefined ? true : elem.enable,
      inputList: [
        {
          label: elem.label,
          value: elem.value,
        },
      ],
      groupSelectList: [],
      checkList: [],
      selectList: [],
      multipleGroupSelectList: [],
      tableList: [],
    });
  } else {
    rList[idx].inputList.push({
      label: elem.label,
      value: elem.value,
    });
  }
  pushTo === "rendererList" && addRendererListToWindow();
};
//给渲染列表添加selectList类型元素
const pushElementToSelectList = (
  elem: {
    targetGroupLabel: string;
    label: string;
    options: string[];
    value: string;
    enable?: boolean;
  },
  pushTo: "rendererList" | "previewRendererList" = "rendererList"
) => {
  const { rendererList, previewRendererList } = useListStore();
  let rList = rendererList;
  if (pushTo === "previewRendererList") {
    rList = previewRendererList;
  }
  const idx = rList.findIndex((g) => g.groupLabel === elem.targetGroupLabel);
  if (idx === -1) {
    //目标组不存在则新增目标组
    rList.push({
      groupLabel: elem.targetGroupLabel,
      enable: elem.enable === undefined ? true : elem.enable,
      groupSelectList: [],
      checkList: [],
      selectList: [
        {
          label: elem.label,
          options: elem.options,
          value: elem.value,
        },
      ],
      multipleGroupSelectList: [],
      tableList: [],
      inputList: [],
    });
  } else {
    rList[idx].selectList.push({
      label: elem.label,
      options: elem.options,
      value: elem.value,
    });
  }
  pushTo === "rendererList" && addRendererListToWindow();
};
//给渲染列表添加groupSelectList类型元素
const pushElementToGSList = (
  elem: {
    targetGroupLabel: string;
    label: string;
    options: {
      groupLabel: string;
      options: {
        value: string;
        label: string;
      }[];
    }[];
    value: string;
    enable?: boolean;
  },
  pushTo: "rendererList" | "previewRendererList" = "rendererList"
) => {
  const { rendererList, previewRendererList } = useListStore();
  let rList = rendererList;
  if (pushTo === "previewRendererList") {
    rList = previewRendererList;
  }
  const idx = rList.findIndex((g) => g.groupLabel === elem.targetGroupLabel);
  if (idx === -1) {
    //目标组不存在则新增目标组
    rList.push({
      groupLabel: elem.targetGroupLabel,
      enable: elem.enable === undefined ? true : elem.enable,
      groupSelectList: [
        {
          label: elem.label,
          options: elem.options,
          value: elem.value,
        },
      ],
      checkList: [],
      selectList: [],
      multipleGroupSelectList: [],
      tableList: [],
      inputList: [],
    });
  } else {
    rList[idx].groupSelectList.push({
      label: elem.label,
      options: elem.options,
      value: elem.value,
    });
  }
  pushTo === "rendererList" && addRendererListToWindow();
};
//给渲染列表添加multipleGroupSelectList类型元素
const pushElementToMGSList = (
  elem: {
    targetGroupLabel: string;
    label: string;
    options: {
      groupLabel: string;
      options: {
        value: string;
        label: string;
      }[];
    }[];
    limit?: number;
    value: string[];
    enable?: boolean;
  },
  pushTo: "rendererList" | "previewRendererList" = "rendererList"
) => {
  const { rendererList, previewRendererList } = useListStore();
  let rList = rendererList;
  if (pushTo === "previewRendererList") {
    rList = previewRendererList;
  }
  const idx = rList.findIndex((g) => g.groupLabel === elem.targetGroupLabel);
  if (idx === -1) {
    //目标组不存在则新增目标组
    rList.push({
      groupLabel: elem.targetGroupLabel,
      enable: elem.enable === undefined ? true : elem.enable,
      checkList: [],
      selectList: [],
      groupSelectList: [],
      inputList: [],

      multipleGroupSelectList: [
        {
          label: elem.label,
          options: elem.options,
          limit: elem.limit === undefined ? 0 : elem.limit,
          value: elem.value,
        },
      ],
      tableList: [],
    });
  } else {
    rList[idx].multipleGroupSelectList.push({
      label: elem.label,
      options: elem.options,
      limit: elem.limit,
      value: elem.value,
    });
  }
  pushTo === "rendererList" && addRendererListToWindow();
};
const pushElementToTableList = (
  elem: {
    targetGroupLabel: string;
    label: string;
    tableData: object[];
    tableHeader: TableFormHeader[];
    inputProp: {
      propLabel: string;
      type: "select" | "input" | "input-number";
      value: string | number;
      options: string[];
    }[];
    enable?: boolean;
  },
  pushTo: "rendererList" | "previewRendererList" = "rendererList"
) => {
  const { rendererList, previewRendererList } = useListStore();
  let rList = rendererList;
  if (pushTo === "previewRendererList") {
    rList = previewRendererList;
  }
  const idx = rList.findIndex((g) => g.groupLabel === elem.targetGroupLabel);
  if (idx === -1) {
    //目标组不存在则新增目标组
    rList.push({
      groupLabel: elem.targetGroupLabel,
      enable: elem.enable === undefined ? true : elem.enable,
      checkList: [],
      selectList: [],
      groupSelectList: [],
      multipleGroupSelectList: [],
      inputList: [],
      tableList: [
        {
          label: elem.label,
          tableData: elem.tableData,
          tableHeader: elem.tableHeader,
          inputProp: elem.inputProp,
        },
      ],
    });
  } else {
    rList[idx].tableList.push({
      label: elem.label,
      tableData: elem.tableData,
      tableHeader: elem.tableHeader,
      inputProp: elem.inputProp,
    });
  }
  pushTo === "rendererList" && addRendererListToWindow();
};
//渲染UI表单
const buildForm = (
  buildFormList: (
    | {
        targetGroupLabel: string;
        type:
          | "input"
          | "multiplSelection"
          | "groupSelect"
          | "select"
          | "check"
          | "table";
        label: string;
        options: {
          groupLabel: string;
          options: {
            value: string;
            label: string;
          }[];
        }[];
        limit?: number;
        value: string[];
        enable?: boolean;
      }
    | {
        targetGroupLabel: string;
        type:
          | "input"
          | "multiplSelection"
          | "groupSelect"
          | "select"
          | "check"
          | "table";
        label: string;
        options: {
          groupLabel: string;
          options: {
            value: string;
            label: string;
          }[];
        }[];
        value: string;
        enable?: boolean;
      }
    | {
        targetGroupLabel: string;
        type:
          | "input"
          | "multiplSelection"
          | "groupSelect"
          | "select"
          | "check"
          | "table";
        label: string;
        options: string[];
        value: string;
        enable?: boolean;
      }
    | {
        targetGroupLabel: string;
        type:
          | "input"
          | "multiplSelection"
          | "groupSelect"
          | "select"
          | "check"
          | "table";
        label: string;
        tableData: object[];
        tableHeader: TableFormHeader[];
        inputProp: {
          propLabel: string;
          type: "select" | "input" | "input-number";
          value: string | number;
          options: string[];
        }[];
        enable?: boolean;
      }
    | {
        targetGroupLabel: string;
        type:
          | "input"
          | "multiplSelection"
          | "groupSelect"
          | "select"
          | "check"
          | "table";
        label: string;
        checked: boolean;
        enable?: boolean;
      }
    | {
        targetGroupLabel: string;
        type:
          | "input"
          | "multiplSelection"
          | "groupSelect"
          | "select"
          | "check"
          | "table";
        label: string;
        value: string;
        enable?: boolean;
      }
  )[],
  pushTo: "rendererList" | "previewRendererList" = "rendererList"
) => {
  const listStore = useListStore();
  if (pushTo === "previewRendererList") {
    listStore.previewRendererList.splice(
      0,
      listStore.previewRendererList.length
    );
  }
  for (let i = 0; i < buildFormList.length; i++) {
    const item = buildFormList[i];
    if (item.type === "multiplSelection") {
      pushElementToMGSList(
        item as {
          targetGroupLabel: string;
          label: string;
          options: {
            groupLabel: string;
            options: {
              value: string;
              label: string;
            }[];
          }[];
          limit?: number;
          value: string[];
          enable?: boolean;
        },
        pushTo
      );
    } else if (item.type === "groupSelect") {
      pushElementToGSList(
        item as {
          targetGroupLabel: string;
          label: string;
          options: {
            groupLabel: string;
            options: {
              value: string;
              label: string;
            }[];
          }[];
          value: string;
          enable?: boolean;
        },
        pushTo
      );
    } else if (item.type === "select") {
      pushElementToSelectList(
        item as {
          targetGroupLabel: string;
          label: string;
          options: string[];
          value: string;
          enable?: boolean;
        },
        pushTo
      );
    } else if (item.type === "table") {
      pushElementToTableList(
        item as {
          targetGroupLabel: string;
          label: string;
          tableData: object[];
          tableHeader: TableFormHeader[];
          inputProp: {
            propLabel: string;
            type: "select" | "input" | "input-number";
            value: string | number;
            options: string[];
          }[];
          enable?: boolean;
        },
        pushTo
      );
    } else if (item.type === "check") {
      pushElementToCheckList(
        item as {
          targetGroupLabel: string;
          label: string;
          checked: boolean;
          enable?: boolean;
        },
        pushTo
      );
    } else {
      pushElementToInputList(
        item as {
          targetGroupLabel: string;
          label: string;
          value: string;
          enable?: boolean;
        },
        pushTo
      );
    }
  }
};
const allTask = ref(1);
const curTask = ref(0);
const curTaskName = ref("");
const taskStatus = ref<"success" | "warning" | "exception" | "">("");
const getAllTask = () => allTask.value;
const getCurTask = () => curTask.value;
const getCurTaskName = () => curTaskName.value;
const getTaskStatus = () => taskStatus.value;
let onEditorMounted: ((editor: monaco.editor.IStandaloneCodeEditor) => void)[] =
  [];
const registerEditorEvent = (name: string, cb: (event: any) => void) => {
  if (name === "mounted") {
    onEditorMounted.push(cb);
  }
};
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
const editorValue = ref("");
export const useScriptApi = () => {
  /**
   * 在编辑器指定范围插入文本
   * @param text 需要插入的文本
   * @param insertHead 是否插入脚本头部声明
   * @param range 范围参数
   * @returns
   */
  const insertText = (
    text: string,
    insertHead = false,
    range?: {
      startLineNumber: number;
      startColumn: number;
      endLineNumber: number;
      endColumn: number;
    }
  ) => {
    const curSelection = editor!.getSelection()!; // 选择的文本范围或光标的当前位置
    const { startLineNumber, startColumn, endLineNumber, endColumn } = range
      ? range
      : curSelection;
    if (insertHead) {
      const txt: string = editor!.getValue();
      const originText =
        txt.indexOf("请勿删除，此声明会在脚本读取时用到！") === -1
          ? txt
          : txt.replace(txt.substring(0, txt.indexOf(" */") + 3), "");
      return editor!.setValue(text + "\n" + originText);
    }
    // 在光标位置插入文本
    editor!.executeEdits("", [
      {
        range: new monaco.Range(
          startLineNumber,
          startColumn,
          endLineNumber,
          endColumn
        ),
        text, // 插入的文本
        forceMoveMarkers: true,
      },
    ]);
    editor!.focus();
    // 核心 设置光标的位置
    editor!.setPosition({
      column: startColumn + text.length,
      lineNumber: startLineNumber,
    });
  };
  let setTextTimer: any = null;
  const setText = (text: string) => {
    setTextTimer && clearTimeout(setTextTimer);
    setTextTimer = setTimeout(() => {
      if (editor) {
        editor.setValue("");
        editor.setValue(text);
      }
      clearTimeout(setTextTimer);
    }, 200);
  };
  const editorInit = () => {
    nextTick(async () => {
      const languages = monaco.languages.getLanguages();
      const supportLanguageIds = ["javascript", "typescript", "json"];
      //禁用语言
      languages.forEach((language) => {
        if (supportLanguageIds.indexOf(language.id) === -1) {
          monaco.languages.setLanguageConfiguration(language.id, {});
        }
      });
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
      });
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        moduleResolution:
          monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        allowNonTsExtensions: true,
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        noEmit: true,
        typeRoots: ["node_modules/@types"],
      });
      monaco.languages.register({
        id: "typescript",
        extensions: [".ts"],
        aliases: ["TypeScript", "ts", "typescript"],
        mimetypes: ["text/typescript"],
      });
      monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
      monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
      monaco.languages.registerCompletionItemProvider("typescript", {
        provideCompletionItems: async function (model, position) {
          const { createDependencyProposals } = AutoTipUtils;
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };
          return {
            suggestions: await createDependencyProposals(range),
          };
        },
      });
      const appGSStore = useAppGlobalSettings();
      let editorTheme = "vs";
      const settingEditorTheme = appGSStore.editor.theme.value;
      if (settingEditorTheme === "跟随全局主题") {
        const isDark = useDark({});
        editorTheme = isDark.value ? "vs-dark" : "vs";
      } else {
        editorTheme = settingEditorTheme === "明亮" ? "vs" : "vs-dark";
      }
      //将editorTsDeclaration写入到csfr.d.ts文件中
      try {
        if (
          appGSStore.envSetting.workDir &&
          appGSStore.envSetting.workDir.length
        ) {
          const targetPath = await pathUtils.join(
            appGSStore.envSetting.workDir,
            "./lib/csfr.d.ts"
          );
          await writeTextFile(targetPath, editorTsDeclaration);
        }
      } catch (error) {
        console.error("辅助声明文件写入失败：", error);
      }
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        editorTsDeclaration
      );
      !editor
        ? (editor = monaco.editor.create(
            document.getElementById("codeEditBox") as HTMLElement,
            {
              value: editorValue.value, // 编辑器初始显示文字
              language: "typescript", // 语言支持自行查阅demo
              automaticLayout: true, // 自适应布局
              theme: editorTheme, // 官方自带三种主题vs, hc-black, or vs-dark
              foldingStrategy: "indentation",
              renderLineHighlight: "all", // 行亮
              selectOnLineNumbers: true, // 显示行号
              tabSize: 2, // tab缩进大小
              minimap: {
                enabled: true,
              },
              readOnly: false, // 只读
              fontSize: 16, // 字体大小
              scrollBeyondLastLine: false, // 取消代码后面一大段空白
              overviewRulerBorder: false, // 不要滚动条的边框
            }
          ))
        : editor!.setValue("");
      onEditorMounted.forEach((cb) => {
        cb(editor!);
      });
      // 监听值的变化
      editor.onDidChangeModelContent((_val: any) => {
        editorValue.value = editor!.getValue();
      });
    });
  };
  const formatCode = () => {
    editor?.getAction("editor.action.formatDocument")?.run();
  };
  const disposeEditor = () => {
    editor?.dispose();
    editor = null;
  };
  const unRegisterEditorEvent = (name: string) => {
    if (name === "mounted") {
      onEditorMounted = [];
    }
  };
  // @ts-ignore
  self.MonacoEnvironment = {
    getWorker(_: string, label: string) {
      if (label === "json") {
        return new jsonWorker();
      }
      if (label === "css" || label === "scss" || label === "less") {
        return new cssWorker();
      }
      if (label === "html" || label === "handlebars" || label === "razor") {
        return new htmlWorker();
      }
      if (["typescript", "javascript"].includes(label)) {
        return new tsWorker();
      }
      return new EditorWorker();
    },
  };
  const getEditor = () => editor;
  const getFnProxyStrings = (runId: string) => {
    return getInvokeApiFnProxyStrings(runId) + "\n";
  };
  return {
    importLastRunConfig,
    getFnProxyStrings,
    replaceRendererList,
    pushElementToCheckList,
    pushElementToInputList,
    pushElementToSelectList,
    pushElementToGSList,
    pushElementToMGSList,
    pushElementToTableList,
    buildForm,
    setAllTask,
    setCurTask,
    getAllTask,
    getCurTask,
    getCurTaskName,
    nextTask,
    getTaskStatus,
    setTaskEndStatus,
    buildTableForm,
    editorValue,
    editorInit,
    insertText,
    setText,
    formatCode,
    getEditor,
    disposeEditor,
    registerEditorEvent,
    unRegisterEditorEvent,
    allRunTimeApi: {
      ...exportAllFn(),
    },
  };
};
