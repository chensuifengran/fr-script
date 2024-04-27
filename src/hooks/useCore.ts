import { BuiltInApiType } from "../invokes/BuiltInApiType";
export const CORE_NAMESPACES = "__FR_BUILT_IN_API__";
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

const builtInApiTestModules = computed({
  set: () => {},
  get: () => {
    return builtInApi.map((i) => i.testModule);
  },
});
const moveBuiltInApiIndex = (oldIndex: number, newIndex: number) => {
  const target = builtInApi[oldIndex];
  builtInApi.splice(oldIndex, 1);
  builtInApi.splice(newIndex, 0, target);
  if (builtInApi[newIndex + 1] && target.testModule) {
    const nextWeight = builtInApi[newIndex + 1].testModule?.weight;
    target.testModule.weight = nextWeight || 0;
  } else if (!builtInApi[newIndex + 1]) {
    //移到最后
    target.testModule!.weight = 0;
  }
  const sortMap: Record<string, number> = {};
  builtInApi.forEach((i, index) => {
    sortMap[i.name] = index;
  });
  localStorage.setItem(
    CORE_NAMESPACES + "API_SORT_MAP",
    JSON.stringify(sortMap)
  );
};
const initBuiltInApi = (
  methods: InvokeApiMethodType[] | InvokeApiMethodType
) => {
  const sortMap = JSON.parse(
    localStorage.getItem(CORE_NAMESPACES + "API_SORT_MAP") || "{}"
  );
  if (methods instanceof Array) {
    if (Object.keys(sortMap).length > 0) {
      const newBuiltInApi = new Array(methods.length).fill(null);
      const newApi: InvokeApiMethodType[] = [];
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
        const sortIndex = sortMap[invokeApiMethod.name];
        if (sortIndex !== undefined) {
          newBuiltInApi[sortIndex] = invokeApiMethod;
        } else {
          newApi.push(invokeApiMethod);
        }
      });
      builtInApi.splice(
        0,
        0,
        ...[...newBuiltInApi.filter((item) => item !== null), ...newApi]
      );
    } else {
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
    }
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
  if (Object.keys(sortMap).length === 0) {
    builtInApi.sort((a, b) => {
      return b!.testModule!.weight! - a!.testModule!.weight!;
    });
  }else{
    builtInApi.forEach((item, index)=>{
      item.testModule!.weight = builtInApi.length - index;
    })
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
        const scope = i.scope;
        allFn[scope] = allFn[i.scope] || {};
        allFn[scope][alias] = fn;
        if (i.helperClass) {
          i.helperClass.forEach((helperClass) => {
            const className = helperClass.name;
            if (className === alias) {
              console.error(
                "helperClass的name不能和alias相同",
                JSON.stringify(i)
              );
              throw new Error(`helperClass的name不能和alias相同`);
            }
            if (allFn[scope][className]) {
              console.warn(
                "helperClass的name和已存在的方法名或辅助类类名相同,跳过注入！",
                JSON.stringify(i)
              );
              return;
            }
            allFn[scope][className] = helperClass;
          });
        }
        return;
      }
      allFn[alias] = fn;
      if (i.helperClass) {
        i.helperClass.forEach((helperClass) => {
          const className = helperClass.name;
          if (className === alias) {
            console.error(
              "helperClass的name不能和alias相同",
              JSON.stringify(i)
            );
            throw new Error(`helperClass的name不能和alias相同`);
          }
          if (allFn[className]) {
            console.warn(
              "helperClass的name和已存在的方法名或辅助类类名相同,跳过注入！",
              JSON.stringify(i)
            );
            return;
          }
          allFn[className] = helperClass;
        });
      }
    } else {
      if (i.scope) {
        const scope = i.scope;
        allFn[scope] = allFn[i.scope] || {};
        allFn[scope][i.name] = fn;
        if (i.helperClass) {
          i.helperClass.forEach((helperClass) => {
            const className = helperClass.name;
            if (className === i.name) {
              console.error(
                "helperClass的name不能和alias相同",
                JSON.stringify(i)
              );
              throw new Error(`helperClass的name不能和alias相同`);
            }
            if (allFn[scope][className]) {
              console.warn(
                "helperClass的name和已存在的方法名或辅助类类名相同,跳过注入！",
                JSON.stringify(i)
              );
              return;
            }
            allFn[scope][className] = helperClass;
          });
        }
        return;
      }
      allFn[i.name] = fn;
      if (i.helperClass) {
        i.helperClass.forEach((helperClass) => {
          const className = helperClass.name;
          if (className === i.name) {
            console.error(
              "helperClass的name不能和alias相同",
              JSON.stringify(i)
            );
            throw new Error(`helperClass的name不能和alias相同`);
          }
          if (allFn[className]) {
            console.warn(
              "helperClass的name和已存在的方法名或辅助类类名相同,跳过注入！",
              JSON.stringify(i)
            );
            return;
          }
          allFn[className] = helperClass;
        });
      }
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
    builtInApiTestModules,
    setTestModuleCtx,
    invokeDynamicDialog,
    exportAllFn,
    registerAllInvokeApi,
    moveBuiltInApiIndex,
  };
};
export const getInvokeApiMethods = () => {
  return builtInApi;
};
