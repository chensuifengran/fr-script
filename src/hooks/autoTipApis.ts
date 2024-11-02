import * as monaco from "monaco-editor";
import { type AnalyzeFnInfoParams } from "../utils/astWorker";
import { MockCodeSnippet } from "./usePlayMock";
type FnInfo = {
  name: string;
  scope?: string;
  params: AnalyzeFnInfoParams[];
  content?: string;
  haveAuxiliary?: boolean;
  paramsRange: {
    startLineNumber: number;
    endLineNumber: number;
    startColumn: number;
    endColumn: number;
  };
};
const { resolve } = pathUtils;

const buildFormEditorVisible = ref(false);

const fnInfo = ref<FnInfo | null>(null);
const getFnInfo = () => fnInfo;

const pathStrProcess = (pathStr: string) => {
  if (pathStr?.length === 0) return pathStr;
  return pathStr?.replaceAll("\\", "\\\\");
};

/**
 * @param path 需要处理的路径
 * @returns 如果path包含路径常量，则替换成常量名[+"相对路径"]，否则返回"path"
 */
const replaceConstantPath = (path: string) => {
  const appGSStore = useAppGlobalSettings();
  let { workDir, screenshotSavePath } = appGSStore.envSetting;
  path = path.replaceAll("\\", "\\\\");
  workDir = workDir.replaceAll("\\", "\\\\");
  screenshotSavePath = screenshotSavePath.replaceAll("\\", "\\\\");
  if (path === screenshotSavePath) {
    return "SCREEN_SHOT_PATH";
  } else if (path.startsWith(screenshotSavePath)) {
    return `SCREEN_SHOT_PATH+"${path.slice(screenshotSavePath.length)}"`;
  }
  if (path === workDir) {
    return "WORK_DIR";
  } else if (path.startsWith(workDir)) {
    return `WORK_DIR+"${path.slice(workDir.length)}"`;
  }
  return `"${path}"`;
};

const pathStrReset = (pathStr: string) => {
  if (pathStr?.length === 0) return pathStr;
  return pathStr?.replace(/\\\\/g, "\\");
};

const stringParamsProcess = async (
  content: string | undefined
): Promise<string> => {
  if (content === undefined) {
    return "";
  }
  const appGSStore = useAppGlobalSettings();
  const { currentScriptDir } = useScriptRuntime();
  const arg = content
    .replace(/\s/g, "")
    .replace("WORK_DIR+", pathStrProcess(appGSStore.envSetting.workDir))
    .replace(
      "SCREEN_SHOT_PATH+",
      pathStrProcess(appGSStore.envSetting.screenshotSavePath)
    )
    .replace(
      "SCREEN_SHOT_PATH",
      pathStrProcess(appGSStore.envSetting.screenshotSavePath)
    )
    .replace(
      "SCREEN_SHOT_DIR+",
      pathStrProcess(
        await resolve(appGSStore.envSetting.screenshotSavePath, "..")
      )
    )
    .replace("SCRIPT_ROOT_DIR+", pathStrProcess(currentScriptDir.value));
  return arg;
};

const paramsProcess = (...args: AnalyzeFnInfoParams[]) =>
  Promise.all(
    args.map(async (p) => {
      const value =
        p.type === "string" ? await stringParamsProcess(p.value) : p.value;
      return {
        ...p,
        value,
      };
    })
  );

const getCursorPosFnInfo = async (
  editor: monaco.editor.IStandaloneCodeEditor | undefined
) => {
  if (!editor) {
    return;
  }
  const model = editor.getModel();
  if (!model) {
    return;
  }
  console.time("getCursorPosFnInfo");
  const position = editor.getPosition();
  let cursorOffset = model.getOffsetAt(position!) || 0;
  const oldCursorOffset = cursorOffset;
  let code = model.getValue() || "";
  const oldCode = code;
  const beforePreCode = code.substring(0, cursorOffset);
  let afterPreCode = beforePreCode;
  const constants = getLastConstants();
  Object.keys(constants).forEach((key) => {
    code = code.replaceAll(key, `"${constants[key]}"`);
    afterPreCode = afterPreCode.replaceAll(key, `"${constants[key]}"`);
  });
  for (const enumKey in inject_enums) {
    const enumConfig = inject_enums[enumKey];
    for (const key in enumConfig) {
      const item = enumConfig[key];
      code = code.replaceAll(`${enumKey}.${key}`, `"${item.value}"`);
      afterPreCode = afterPreCode.replaceAll(
        `${enumKey}.${key}`,
        `"${item.value}"`
      );
    }
  }
  cursorOffset += afterPreCode.length - beforePreCode.length;
  const result = await astWorker.analyzeFnInfo(
    model,
    position,
    code,
    cursorOffset
  );
  if (!result) {
    return;
  }
  if (result.params?.length) {
    result.params = result.params.map((p) => {
      if (p.value) {
        return p;
      } else {
        const STRING_QUOTATION_MARK_REGEX = /(^["'`]{1,2})|(["'`]{1,2}$)/g;
        const contentEQType =
          p.expression
            .replace(STRING_QUOTATION_MARK_REGEX, "")
            .replace(/\\/g, "") ===
          p.type.replace(STRING_QUOTATION_MARK_REGEX, "").replace(/\\/g, "");
        return {
          ...p,
          value: contentEQType
            ? p.expression.replace(STRING_QUOTATION_MARK_REGEX, "")
            : "",
        };
      }
    });
  }
  const oldResult = await astWorker.analyzeFnInfo(
    model,
    position,
    oldCode,
    oldCursorOffset
  );
  result!.paramsRange = oldResult?.paramsRange || result.paramsRange;
  result.params = result.params.map((p) => {
    const v = p.value;
    let expression: any;
    try {
      expression = new Function(`return ${p.expression}`)();
      if (Array.isArray(v)) {
        p.value = v.map((item, index) => {
          if (typeof item === "object") {
            Object.entries(item).forEach(([key, value]) => {
              if (typeof value === "string") {
                if (value.startsWith("__FUNC__")) {
                  let funcStr = value.replace("__FUNC__", "");
                  item[key] = new Function(`return ${funcStr}`)();
                }
              }
              if (Array.isArray(expression)) {
                const expressionItem = expression[index];
                item[key] = item[key] || expressionItem[key];
              }
            });
          }
          return item;
        });
      }
    } catch (error) {
      console.error("new Function error:", p.expression, error);
    }
    return p;
  });

  fnInfo.value = result;
  if (!fnInfo.value) {
    console.timeEnd("getCursorPosFnInfo");
    return;
  }
  const target = getInvokeApiMethods()
    .map((i) => {
      return {
        scope: i.scope,
        ...i.testModule,
        haveAuxiliary: i.auxiliary !== undefined,
      };
    })
    .find((i) => {
      if (i.scope) {
        const _scope = i.scope || "";
        return (
          _scope === (fnInfo.value?.scope || "") &&
          i.dialog!.targetMethodName === fnInfo.value?.name
        );
      }
      return i?.dialog!.targetMethodName === fnInfo.value!.name;
    });
  if (target === undefined) {
    fnInfo.value = null;
    console.timeEnd("getCursorPosFnInfo");
    return;
  }
  if (fnInfo.value) {
    fnInfo.value.content = target.document?.howToUse;
    fnInfo.value.haveAuxiliary = target.haveAuxiliary;
  }
  console.timeEnd("getCursorPosFnInfo");
};
let getCursorPosFnInfoTimer: NodeJS.Timeout | null = null;

const apiAutoTip = async () => {
  // 获取编辑器实例
  const editor = findEditor("codeEditBox");
  if (!editor) {
    return;
  }
  getCursorPosFnInfoTimer && clearTimeout(getCursorPosFnInfoTimer);
  getCursorPosFnInfoTimer = setTimeout(() => {
    getCursorPosFnInfo(editor);
  }, 50);
};

//编辑器的代码片段
const createDependencyProposals = async (range: {
  startLineNumber: number;
  endLineNumber: number;
  startColumn: number;
  endColumn: number;
}): Promise<
  {
    label: string;
    kind: monaco.languages.CompletionItemKind;
    detail: string;
    insertText: string;
    insertTextRules: monaco.languages.CompletionItemInsertTextRule;
    range: {
      startLineNumber: number;
      endLineNumber: number;
      startColumn: number;
      endColumn: number;
    };
  }[]
> => {
  //获取当前文件夹下的所有index.ts模块
  const allModulesAndFn = import.meta.glob("../invokes/**/index.ts", {
    eager: true,
  });
  const _apiModules = [];
  const res = Object.entries(allModulesAndFn);
  for (let index = 0; index < res.length; index++) {
    const [key, value] = res[index];
    const paths = key.split("/");
    const apiName = paths[paths.length - 2];
    const module = (value as any)[apiName + "Api"] || (value as any)[apiName];
    if (!module) {
      console.error(`找不到${apiName}Api或${apiName}模块`);
    } else {
      _apiModules.push(module);
    }
  }
  const appGSStore = useAppGlobalSettings();
  const allModules = _apiModules
    .map((modules) => {
      if (typeof modules === "function") {
        return modules(appGSStore);
      } else {
        return modules;
      }
    })
    .map((module: InvokeApiMethodType) => {
      const insertText = module.testModule?.document?.codeSnippet;
      if (insertText === undefined) {
        return null;
      } else {
        const label = module.name + "()";
        return {
          label,
          kind: monaco.languages.CompletionItemKind.Function,
          detail: module.testModule?.document?.howToUse || "",
          insertText,
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
        };
      }
    });
  const codeSnippetList = await Promise.all([
    ...(IS_PLAYGROUND_ENV
      ? usePlayMock().mockCodeSnippetList.value
      : useListStore().codeSnippets
    ).map(async (item: MockCodeSnippet) => {
      const label = item.prefix;
      const detail = item.description || "";
      const insertText = IS_PLAYGROUND_ENV
        ? item.content
        : await fsUtils.readFile(item.filePath);
      return {
        label,
        kind: monaco.languages.CompletionItemKind.Snippet,
        detail: item.name + ":" + detail,
        insertText: insertText?.trim() || "",
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
      };
    }),
  ]);
  const allSnippet = allModules.filter((i) => i !== null) as {
    label: string;
    kind: monaco.languages.CompletionItemKind;
    detail: string;
    insertText: string;
    insertTextRules: monaco.languages.CompletionItemInsertTextRule;
    range: {
      startLineNumber: number;
      endLineNumber: number;
      startColumn: number;
      endColumn: number;
    };
  }[];
  return [...allSnippet, ...codeSnippetList];
};
export const AutoTipUtils = {
  getFnInfo,
  paramsProcess,
  createDependencyProposals,
  pathStrProcess,
  pathStrReset,
  apiAutoTip,
  replaceConstantPath,
  buildFormEditorVisible,
};
