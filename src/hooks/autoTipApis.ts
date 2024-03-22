import * as monaco from "monaco-editor";
type FnInfo = {
  fnType?: "invokeApi" | "util";
  name: string;
  scope?: string;
  params: any[];
  content?: string;
  haveAuxiliary?: boolean;
  paramsRange: {
    startLineNumber: number;
    endLineNumber: number;
    startColumn: number;
    endColumn: number;
  };
};

const { basename, resolve } = pathUtils;
const { getInvokeApiMethods } = useInvokeApiMethodsRegister();

const fnInfo = ref<FnInfo | null>(null);
const getFnInfo = () => fnInfo;

const pathStrProcess = (pathStr: string) => {
  if (pathStr?.length === 0) return pathStr;
  return pathStr.replaceAll("\\", "\\\\");
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
  return pathStr.replaceAll("\\\\", "\\");
};

const paramsProcess = async (args: string[]) => {
  const appGSStore = useAppGlobalSettings();
  const { currentScriptDir } = useScriptRuntime();

  const _params: string[] = [];
  for (let index = 0; index < args.length; index++) {
    let i = args[index].replaceAll('"', "").replaceAll("'", "");
    const arg = i
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
    _params.push(arg);
  }
  return _params;
};
const strIndexOfApi = (str: string) => {
  if (str?.length === 0) return -1;
  for (const api of getInvokeApiMethods()) {
    if (api.exportFn) {
      if (api.scope) {
        const index = str.indexOf(
          api.exportFn.alias
            ? api.scope + "." + api.exportFn.alias
            : api.scope + "." + api.name
        );
        if (index !== -1) {
          const length = api.exportFn.alias
            ? api.scope.length + api.exportFn.alias.length + 1
            : api.scope.length + api.name.length + 1;
          if (str[index + length] !== "(" || !/\s/.test(str[index + length])) {
            const newStr = str.slice(index + length);
            const newStrIndex = newStr.indexOf(api.exportFn.alias || api.name);
            return newStrIndex === -1 ? index : index + length + newStrIndex;
          }
          return index;
        } else {
          //如果没找到，则尝试匹配不带scope的名字
          const index = str.indexOf(api.exportFn.alias || api.name);
          if (index !== -1) {
            const length = api.exportFn.alias?.length || api.name?.length;
            if (
              str[index + length] !== "(" ||
              !/\s/.test(str[index + length])
            ) {
              const newStr = str.slice(index + length);
              const newStrIndex = newStr.indexOf(
                api.exportFn.alias || api.name
              );
              return newStrIndex === -1 ? index : index + length + newStrIndex;
            }
            return index;
          }
        }
      } else {
        const index = str.indexOf(api.exportFn.alias || api.name);
        if (index !== -1) {
          const length = api.exportFn.alias?.length || api.name?.length;
          if (str[index + length] !== "(" || !/\s/.test(str[index + length])) {
            const newStr = str.slice(index + length);
            const newStrIndex = newStr.indexOf(api.exportFn.alias || api.name);
            return newStrIndex === -1 ? index : index + length + newStrIndex;
          }
          return index;
        } else continue;
      }
    }
  }
  return -1;
};

const apiAutoTip = () => {
  const { getEditor } = useScriptApi()!;
  // 获取编辑器实例
  const editor = getEditor();
  // 获取当前选择的文本范围或光标的当前位置
  const curSelection = editor?.getSelection()!;
  // 获取当前选择的文本所在行的行号
  const { startLineNumber } = curSelection;
  // 获取当前文本模型
  const mod = editor?.getModel();
  // 获取当前选择的文本所在行的内容
  const curLineContent = mod?.getLineContent(startLineNumber) || "";
  const endIndex = curLineContent.lastIndexOf(")");
  const startIndex = curLineContent.lastIndexOf("(");
  if (endIndex !== -1) {
    //↑当前行匹配到)
    if (startIndex !== -1 && startIndex < endIndex) {
      //↑当前行匹配到(，并且(在)前面
      const nameIndex = strIndexOfApi(curLineContent);

      if (nameIndex !== -1) {
        if (nameIndex !== 0 && !/\s/.test(curLineContent[nameIndex - 1])) {
          fnInfo.value = null;
          return;
        }
        const targetApiName = curLineContent
          .substring(nameIndex, startIndex)
          .trim();
        const scopeName = targetApiName.split(".");
        fnInfo.value = {
          scope: scopeName.length > 1 ? scopeName[0] : "",
          name: scopeName.length > 1 ? scopeName[1] : scopeName[0],
          params: curLineContent
            .substring(startIndex + 1, endIndex)
            .replace(/\s/g, "")
            .split(","),
          paramsRange: {
            startLineNumber: startLineNumber,
            endLineNumber: startLineNumber,
            startColumn: startIndex + 2,
            endColumn: endIndex + 1,
          },
        };
      } else {
        fnInfo.value = null;
        return;
      }
    } else if (startIndex === -1) {
      //↑当前行没有匹配到(，需要往上面找
      let pre = 0;
      let startFnIndex = curLineContent.lastIndexOf("(");
      let matchContent = curLineContent.substring(0, endIndex + 1);
      while (startFnIndex === -1) {
        //↑当前行没有匹配到(，需要往上面找
        if (--pre + startLineNumber <= 0) {
          //↑第一行还是没有匹配到(，直接返回
          fnInfo.value = null;
          return;
        } else {
          startFnIndex = mod!
            .getLineContent(pre + startLineNumber)
            .lastIndexOf("(");
          const preLineContent =
            mod?.getLineContent(pre + startLineNumber) || "";
          matchContent = preLineContent + matchContent;
        }
      }
      const nameIndex = strIndexOfApi(matchContent);
      if (nameIndex !== 0 && !/\s/.test(matchContent[nameIndex - 1])) {
        fnInfo.value = null;
        return;
      }
      const targetApiName = matchContent
        .substring(nameIndex, startFnIndex)
        .trim();
      const scopeName = targetApiName.split(".");
      fnInfo.value = {
        scope: scopeName.length > 1 ? scopeName[0] : "",
        name: scopeName.length > 1 ? scopeName[1] : scopeName[0],
        params: matchContent
          .substring(startFnIndex + 1, matchContent.length - 1)
          .replace(/\s/g, "")
          .split(","),
        paramsRange: {
          startLineNumber: startLineNumber + pre,
          endLineNumber: startLineNumber,
          startColumn: startFnIndex + 2,
          endColumn: endIndex + 1,
        },
      };
    }
  } else {
    //↑当前行没有匹配到)
    if (startIndex !== -1) {
      //↑当前行匹配到(，需要往下面找
      let next = 0;
      let endFnIndex = curLineContent.lastIndexOf(")");
      let matchContent = curLineContent;
      while (endFnIndex === -1) {
        //↑当前行没有匹配到(，需要往上面找
        if (++next + startLineNumber > mod!.getLineCount()) {
          //↑最后一行还是没有匹配到(，直接返回
          fnInfo.value = null;
          return;
        } else {
          endFnIndex = mod!
            .getLineContent(next + startLineNumber)
            .lastIndexOf(")");
          const nextLineContent =
            mod?.getLineContent(next + startLineNumber) || "";
          matchContent = matchContent + nextLineContent;
        }
      }

      const nameIndex = strIndexOfApi(matchContent);
      const targetApiName = matchContent
        .substring(nameIndex, startIndex)
        .trim();
      if (nameIndex !== 0 && !/\s/.test(matchContent[nameIndex - 1])) {
        fnInfo.value = null;
        return;
      }
      const scopeName = targetApiName.split(".");
      fnInfo.value = {
        scope: scopeName.length > 1 ? scopeName[0] : "",
        name: scopeName.length > 1 ? scopeName[1] : scopeName[0],
        params: matchContent
          .substring(startIndex + 1, matchContent.indexOf(")"))
          .replace(/\s/g, "")
          .split(","),
        paramsRange: {
          startLineNumber: startLineNumber,
          endLineNumber: startLineNumber + next,
          startColumn: startIndex + 2,
          endColumn: endFnIndex + 1,
        },
      };
    } else {
      //↑当前行没有匹配到(和)，需要往上面找和下面找
      let pre = 0;
      let startFnIndex = curLineContent.lastIndexOf("(");
      let matchContent = curLineContent;
      while (startFnIndex === -1) {
        //↑当前行没有匹配到(，需要往上面找
        if (--pre + startLineNumber <= 0) {
          //↑第一行还是没有匹配到(，直接返回
          fnInfo.value = null;
          return;
        } else {
          const preLineStartIndex = mod!
            .getLineContent(pre + startLineNumber)
            .lastIndexOf("(");
          const afterContent = mod!
            .getLineContent(pre + startLineNumber)
            .slice(preLineStartIndex + 1);
          //判断(之后是否存在)，如果存在则不再往上找，直接返回
          if (preLineStartIndex !== -1 && afterContent.includes(")")) {
            fnInfo.value = null;
            return;
          }
          startFnIndex = preLineStartIndex;
          const preLineContent =
            mod?.getLineContent(pre + startLineNumber) || "";
          matchContent = preLineContent + matchContent;
        }
      }
      let next = 0;
      let endFnIndex = curLineContent.lastIndexOf(")");
      while (endFnIndex === -1) {
        //↑当前行没有匹配到(，需要往上面找
        if (++next + startLineNumber > mod!.getLineCount()) {
          //↑最后一行还是没有匹配到(，直接返回
          fnInfo.value = null;
          return;
        } else {
          endFnIndex = mod!
            .getLineContent(next + startLineNumber)
            .lastIndexOf(")");
          const nextLineContent =
            mod?.getLineContent(next + startLineNumber) || "";
          matchContent = matchContent + nextLineContent;
        }
      }

      const nameIndex = strIndexOfApi(matchContent);
      const targetApiName = matchContent
        .substring(nameIndex, startFnIndex)
        .trim();
      if (nameIndex !== 0 && !/\s/.test(matchContent[nameIndex - 1])) {
        fnInfo.value = null;
        return;
      }
      const scopeName = targetApiName.split(".");
      fnInfo.value = {
        scope: scopeName.length > 1 ? scopeName[0] : "",
        name: scopeName.length > 1 ? scopeName[1] : scopeName[0],
        params: matchContent
          .substring(startFnIndex + 1, matchContent.indexOf(")") - 1)
          .replace(/\s/g, "")
          .split(","),
        paramsRange: {
          startLineNumber: startLineNumber + pre,
          endLineNumber: startLineNumber + next,
          startColumn: startFnIndex + 2,
          endColumn: endFnIndex + 1,
        },
      };
    }
  }
  const target = getInvokeApiMethods()
    .map((i) => {
      return {
        scope: i.scope,
        ...i.testModule,
        alias: i.exportFn?.alias,
        itemType: "invokeApi",
        haveAuxiliary: i.auxiliary !== undefined,
      };
    })
    .find((i) => {
      if (i.scope) {
        return (
          i.alias === fnInfo.value!.name ||
          i.scope + "." + i.alias === fnInfo.value!.name ||
          i.dialog!.targetMethodName === fnInfo.value!.name ||
          i.scope + "." + i.dialog!.targetMethodName === fnInfo.value!.name
        );
      }
      return (
        i?.alias === fnInfo.value!.name ||
        i?.dialog!.targetMethodName === fnInfo.value!.name
      );
    });

  if (target === undefined) {
    fnInfo.value = null;
    return;
  }
  if (fnInfo.value) {
    fnInfo.value.fnType = target.itemType as "invokeApi";
    fnInfo.value.content = target.document?.howToUse;
    fnInfo.value.haveAuxiliary = target.haveAuxiliary;
  }
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
  const allModulesAndFn = import.meta.glob("./**/index.ts", {
    eager: true,
  });
  const _apiModules = [];
  const res = Object.entries(allModulesAndFn);
  for (let index = 0; index < res.length; index++) {
    const [key, value] = res[index];
    const apiNamePath = await resolve(key, "..");
    const apiName = await basename(apiNamePath);
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
        const label = (module.exportFn?.alias || module.name) + "()";
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
  return allSnippet;
};
export const AutoTipUtils = {
  strIndexOfApi,
  getFnInfo,
  paramsProcess,
  createDependencyProposals,
  pathStrProcess,
  pathStrReset,
  apiAutoTip,
  replaceConstantPath,
};
