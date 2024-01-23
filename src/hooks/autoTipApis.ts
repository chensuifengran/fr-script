import * as monaco from "monaco-editor";
type FnInfo = {
  fnType?: "invokeApi" | "util";
  name: string;
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
const pathStrReset = (pathStr: string) => {
  if (pathStr?.length === 0) return pathStr;
  return pathStr.replaceAll("\\\\", "\\");
};
const keyMapRegex = /KeyboardMap\.(?:\[["']([^"']+)["']\]|(\w+))/;
const matchKeyMap = (keyMapStr: string) => {
  if (keyMapStr?.length === 0) return keyMapStr;
  const match = keyMapStr.match(keyMapRegex);
  if (match) {
    const key = match[1] || match[2];
    return key.replace(`"\\'\\""`, `'"`).replace(`\\'\\"`, `'"`);
  } else {
    const right = keyMapStr.lastIndexOf('"]') || keyMapStr.lastIndexOf("']");
    if (right !== -1) {
      return keyMapStr
        .slice(0, right)
        .replace("['", "")
        .replace('["', "")
        .replace("KeyboardMap", "")
        .replace(`"\\'\\""`, `'"`)
        .replace(`\\'\\"`, `'"`);
    }
    return keyMapStr
      .replace("KeyboardMap.", "")
      .replace(`"\\'\\""`, `'"`)
      .replace(`\\'\\"`, `'"`);
  }
};

const resetToKeyMapEnum = (keyMapStr: string) => {
  if (keyMapStr?.length === 0) return keyMapStr;
  //判断是否为数字或符号开头，是的话使用中括号访问，否则使用.访问
  const regex = /^[0-9`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
  if (regex.test(keyMapStr)) {
    return `KeyboardMap["${keyMapStr
      .replaceAll('"', '\\"')
      .replaceAll("'", "\\'")}"]`;
  } else {
    return `KeyboardMap.${keyMapStr
      .replaceAll('"', '\\"')
      .replaceAll("'", "\\'")}`;
  }
};

const paramsProcess = async (args: string[]) => {
  const appGSStore = useAppGlobalSettings();
  const runtime = useRuntime();
  const _params: string[] = [];
  for (let index = 0; index < args.length; index++) {
    let i = args[index];
    if (!i.includes("KeyboardMap")) {
      i = i.replaceAll('"', "").replaceAll("'", "");
    }
    const arg = i
      .replaceAll(" ", "")
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
      .replace("SCRIPT_ROOT_DIR+", pathStrProcess(runtime.currentScriptDir));
    _params.push(arg);
  }
  return _params;
};
const strIndexOfApi = (str: string) => {
  if (str?.length === 0) return -1;
  const apiList = [
    ...getInvokeApiMethods().map((i) => {
      return {
        ...i.testModule,
        alias: i.exportFn?.alias,
        itemType: "invokeApi",
      };
    }),
  ].map((i) => i.alias || i!.dialog!.targetMethodName);
  let result = -1;
  apiList.forEach((i) => {
    const index = str.indexOf(i);
    if (index !== -1 && result === -1) {
      result = index;
    }
  });
  return result;
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

        fnInfo.value = {
          name: targetApiName,
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

      fnInfo.value = {
        name: targetApiName,
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
      fnInfo.value = {
        name: targetApiName,
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
          startFnIndex = mod!
            .getLineContent(pre + startLineNumber)
            .lastIndexOf("(");
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
      fnInfo.value = {
        name: targetApiName,
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
  const target = [
    ...getInvokeApiMethods().map((i) => {
      return {
        ...i.testModule,
        alias: i.exportFn?.alias,
        itemType: "invokeApi",
        haveAuxiliary: i.auxiliary !== undefined,
      };
    }),
  ].find(
    (i) =>
      i?.alias === fnInfo.value!.name ||
      i?.dialog!.targetMethodName === fnInfo.value!.name
  );
  
  
  
  if (target === undefined) {
    fnInfo.value = null;
    return;
  }
  fnInfo.value!.fnType = target.itemType as "invokeApi";
  fnInfo.value!.content = target.document?.howToUse;
  fnInfo.value!.haveAuxiliary = target.haveAuxiliary;
};

//编辑器的代码片段
const createDependencyProposals =async (range: {
  startLineNumber: number;
  endLineNumber: number;
  startColumn: number;
  endColumn: number;
}): Promise<{
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
}[]> => {
  //获取当前文件夹下的所有index.ts模块
  const allModulesAndFn = import.meta.glob("./**/index.ts", {
    eager: true,
  });
  const _apiModules = [];
  const res = Object.entries(allModulesAndFn);
  for(let index = 0; index < res.length; index++){
    const [key,value] = res[index];
    const apiNamePath = await resolve(key, "..");
    const apiName = await basename(apiNamePath);
    const module = (value as any)[apiName + "Api"] || (value as any)[apiName];
    if (!module) {
      console.error(`找不到${apiName}Api或${apiName}模块`);
    }else{
      _apiModules.push(module)
    }
  }
  // const apiModules = Object.entries(allModulesAndFn).map(([key, value]) => {
  //   const apiNamePath = await resolve(key, "..");
  //   const apiName = path.basename(apiNamePath);
  //   const module = (value as any)[apiName + "Api"] || (value as any)[apiName];
  //   if (!module) {
  //     console.error(`找不到${apiName}Api或${apiName}模块`);
  //   }
  //   return module;
  // });
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
  matchKeyMap,
  resetToKeyMapEnum,
  apiAutoTip,
};
