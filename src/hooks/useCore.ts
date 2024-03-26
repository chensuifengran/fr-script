import { BuiltInApiType } from "../invokes/BuiltInApiType";
export const CORE_NAMESPACES = '__FR_BUILT_IN_API__';
//弹窗
const dynamicDialog = reactive({
  show: false,
  title: "",
  content: "",
  callType: "test",
  callback: () => {},
});
//testModule callback上下文
const testModuleCtx = <
  {
    showDetails: (text: string | undefined, preStr?: string) => void;
  }
>{
  showDetails: () => {},
};
const builtInApi = reactive<InvokeApiMethodType[]>([]);
//设置testModuleCtx
const setTestModuleCtx = (ct: {
  showDetails: (text: string | undefined, preStr?: string) => void;
}) => {
  testModuleCtx.showDetails = ct.showDetails;
};

const getBuiltInApiTestModules = () => {
  return builtInApi.map((i) => i.testModule);
};
const initBuiltInApi = (
  methods: InvokeApiMethodType[] | InvokeApiMethodType
) => {
  if (methods instanceof Array) {
    methods.forEach((invokeApiMethod) => {
      const targetMethod = builtInApi.find(
        (i) => i.name === invokeApiMethod.name
      );
      if (!/^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(invokeApiMethod.name)) {
        throw new Error(`methods中的name不符合js变量命名规范`);
      }
      if (targetMethod) {
        console.warn("已存在同名方法，跳过注册");
        return;
      }
      builtInApi.push(invokeApiMethod);
    });
  } else {
    const targetMethod = builtInApi.find((i) => i.name === methods.name);
    if (!/^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(methods.name)) {
      throw new Error(`methods中的name不符合js变量命名规范`);
    }
    if (targetMethod) {
      console.warn("已存在同名方法，跳过注册");
      return;
    }
    builtInApi.push(methods);
  }
};
const invokeDynamicDialog = (
  methodName: string,
  title?: string,
  content?: string,
  callType: "test" | "changeArgs" = "test",
  replaceCurFnArgs?: (targetArgs: string) => void,
  currentParams?: string[]
) => {
  const targetMethod = builtInApi.find(
    (i) => i.name === methodName || i.exportFn?.alias === methodName
  );
  if (title && content) {
    dynamicDialog.title = title;
    dynamicDialog.content = content;
    dynamicDialog.show = true;
    dynamicDialog.callType = callType;
  }
  if (targetMethod) {
    if (targetMethod.auxiliary?.parameterBackfill && currentParams) {
      targetMethod.auxiliary.parameterBackfill(...currentParams);
    }
    if (title && content) {
      const cb = async () => {
        const callArgsObject: ExportFns = {
          replaceCurFnArgs,
        };
        const dialog = targetMethod!.testModule!.dialog;
        for (let i = 0; i < dialog.args!.length; i++) {
          const arg = dialog.args![i];
          if (!arg.onlyTest || (arg.onlyTest && callType === "test")) {
            callArgsObject[arg.name] = arg.value;
          }
        }
        targetMethod!.testModule!.callback(callArgsObject, testModuleCtx);
        dynamicDialog.show = false;
      };
      dynamicDialog.callback = cb;
    } else {
      targetMethod!.testModule!.callback(undefined, testModuleCtx);
    }
  }
};
const exportAllFn = (): BuiltInApiType => {
  const allFn: ExportFns = {};
  builtInApi.forEach((i) => {
    if (!i.exportFn) {
      return;
    }
    const { alias, fn } = i.exportFn;
    if (alias && !allFn[alias]) {
      if (i.scope) {
        allFn[i.scope] = allFn[i.scope] || {};
        allFn[i.scope][alias] = fn;
        return;
      }
      allFn[alias] = fn;
    } else {
      if (i.scope) {
        allFn[i.scope] = allFn[i.scope] || {};
        allFn[i.scope][i.name] = fn;
        return;
      }
      allFn[i.name] = fn;
    }
  });
  return allFn as BuiltInApiType;
};
const genBuiltInApi = (runId: string) => {
  return builtInApi
    .map((i) => {
      const name = i.exportFn?.alias || i.name;
      if (i.testModule?.document?.params) {
        const params = i.testModule.document.params
          .map((i) => i.name)
          .join(",");
        return `
        const ${name} = async (${params}) => {
          if(window['${CORE_NAMESPACES}'].isStop) throw new Error("任务已结束");
          const result = await window['${CORE_NAMESPACES}'].${name}(${params}, '${runId}');
          return result;
        }
      `;
      } else {
        return `
        const ${name} = async () => {
          if(window['${CORE_NAMESPACES}'].isStop) throw new Error("任务已结束");
          const result = await window['${CORE_NAMESPACES}'].${name}('${runId}');
          return result;
        }
      `;
      }
    })
    .join("\n");
};
const getApiModules = async () => {
  const apiModules = import.meta.glob("../invokes/**/index.ts", {
    eager: true,
  });
  const _apis = Object.entries(apiModules);
  const apis: any[] = [];
  for (let i = 0; i < _apis.length; i++) {
    const [key, value] = _apis[i];
    const apiNamePath = await pathUtils.join(key, "../");
    const apiName = await pathUtils.basename(apiNamePath);
    const module = (value as any)[apiName + "Api"] || (value as any)[apiName];
    if (!module) {
      console.error(`找不到${apiName}Api或${apiName}模块`);
      continue;
    }
    apis.push(module);
  }
  return apis;
};
const registerAllInvokeApi = async () => {
  const allModules = await getApiModules();
  if (!allModules) return;
  //注册所有api
  initBuiltInApi([...allModules]);
};
export const useCore = () => {
  return {
    genBuiltInApi,
    dynamicDialog,
    getBuiltInApiTestModules,
    setTestModuleCtx,
    invokeDynamicDialog,
    exportAllFn,
    registerAllInvokeApi
  };
};
export const getInvokeApiMethods = () => {
  return builtInApi;
};
