import { nanoid } from "nanoid";
import { type AnalyzeFnInfoParams } from "../utils/astWorker";
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
    showDetails: ShowDetailsFn;
  }
>{
  showDetails: () => {},
};
const builtInApi = reactive<InvokeApiMethodType[]>([]);
//设置testModuleCtx
const setTestModuleCtx = (ct: { showDetails: ShowDetailsFn }) => {
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
  } else {
    builtInApi.forEach((item, index) => {
      item.testModule!.weight = builtInApi.length - index;
    });
  }
};
const invokeDynamicDialog = (
  methodName: string,
  title?: string,
  content?: string,
  callType: "test" | "changeArgs" = "test",
  replaceCurFnArgs?: (targetArgs: string) => void,
  currentParams?: AnalyzeFnInfoParams[]
) => {
  const targetMethod = builtInApi.find((i) => i.name === methodName);
  if (title && content) {
    dynamicDialog.title = title;
    dynamicDialog.content = content;
    dynamicDialog.show = true;
    dynamicDialog.callType = callType;
  }
  if (targetMethod) {
    if (targetMethod.auxiliary?.onDialogOpen && currentParams) {
      targetMethod.auxiliary.onDialogOpen(() => {
        dynamicDialog.show = false;
      }, ...currentParams);
    }
    if (title && content) {
      const cb = async () => {
        const callArgsObject: Record<string, any> = {
          replaceCurFnArgs,
        };
        let needUpdate = false;
        const dialog = targetMethod!.testModule!.dialog;
        let usedIndex = 0;
        for (let i = 0; i < dialog.args!.length; i++) {
          const arg = dialog.args![i];
          if (!arg.onlyTest || (arg.onlyTest && callType === "test")) {
            callArgsObject[arg.name] = arg.value;
            if (
              currentParams &&
              arg.value !== currentParams[i + usedIndex]?.value
            ) {
              if (arg.componentType === "RectInput") {
                const ev = JSON.stringify({
                  x: currentParams[i + usedIndex]?.value,
                  y: currentParams[i + usedIndex + 1]?.value,
                  width: currentParams[i + usedIndex + 2]?.value,
                  height: currentParams[i + usedIndex + 3]?.value,
                });
                if (ev === JSON.stringify(arg.value)) {
                  usedIndex += 3;
                } else {
                  needUpdate = true;
                }
              } else if (
                arg.componentType === "FileInput" ||
                arg.componentType === "DirInput"
              ) {
                if (
                  JSON.stringify(arg.value) !==
                  AutoTipUtils.pathStrReset(
                    JSON.stringify(currentParams[i + usedIndex]?.value)
                  )
                ) {
                  needUpdate = true;
                }
              } else if (
                JSON.stringify(arg.value) !==
                JSON.stringify(currentParams[i + usedIndex]?.value)
              ) {
                if (currentParams[i + usedIndex]?.value === undefined) {
                  const docParam =
                    targetMethod.testModule!.document!.params?.find((p) => {
                      return p.name === arg.name;
                    });
                  if (docParam?.required) {
                    needUpdate = true;
                  } else if (
                    JSON.stringify(docParam?.default).replace(
                      /(^["'`]{1,2})|(["'`]{1,2}$)/g,
                      ""
                    ) !==
                    JSON.stringify(arg.value).replace(
                      /(^["'`]{1,2})|(["'`]{1,2}$)/g,
                      ""
                    )
                  ) {
                    needUpdate = true;
                  }
                } else {
                  needUpdate = true;
                }
              }
            }
          }
        }
        if (!needUpdate && callType === "changeArgs") {
          callArgsObject.replaceCurFnArgs = () => {};
        }
        targetMethod!.testModule!.callback(callArgsObject, testModuleCtx);
        dynamicDialog.show = false;
      };
      dynamicDialog.callback = cb;
    } else {
      targetMethod!.testModule!.callback(undefined, testModuleCtx, []);
    }
  }
};
const exportAllFn = (): BuiltInApiType => {
  const allFn: ExportFns = {};
  builtInApi.forEach((i) => {
    if (!i.exportFn) {
      return;
    }
    const { fn } = i.exportFn;
    if (i.scope) {
      const scope = i.scope;
      allFn[scope] = allFn[i.scope] || {};
      //用于存放当前命名空间的通用数据，此属性不提供给编辑器的类型声明
      allFn[scope]["__NS_DATA__"] = {};
      allFn[scope][i.name] = fn;
      if (i.helperClass) {
        i.helperClass.forEach((helperClass) => {
          const className = helperClass.name;
          if (className === i.name) {
            console.error(
              "helperClass的name不能和api名称相同",
              JSON.stringify(i)
            );
            throw new Error(`helperClass的name不能和api名称相同`);
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
            "helperClass的name不能和api名称相同",
            JSON.stringify(i)
          );
          throw new Error(`helperClass的name不能和api名称相同`);
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
  });
  return allFn as BuiltInApiType;
};
const genBuiltInApi = (runId: string) => {
  return builtInApi
    .map((i) => {
      const name = i.name;
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
export const getApiModules = async (
  skipDisabledApi: boolean = true,
  genId: boolean = false,
  genFullPath: boolean = false
): Promise<InvokeApiMethodType[]> => {
  const apiModules = import.meta.glob("../invokes/**/index.ts", {
    eager: true,
  });
  const _apis = Object.entries(apiModules);
  const apis: any[] = [];
  for (let i = 0; i < _apis.length; i++) {
    const [key, value] = _apis[i];
    const paths = key.split("/");
    const apiName = paths[paths.length - 2];
    const module = (value as any)[apiName + "Api"] || (value as any)[apiName];
    if (!module) {
      console.error(`找不到${apiName}Api或${apiName}模块`);
      continue;
    }
    if (skipDisabledApi && module?.disabled) {
      console.warn(
        `内置API：${module.scope ? module.scope + "." : ""}${module.name}已禁用`
      );
      continue;
    }
    if (genId) {
      module["id"] = nanoid();
    }
    if (genFullPath) {
      module["fullPath"] = await pathUtils.resolve(
        await pathUtils.getInstallDir(),
        "../../../src/a/" + key
      );
    }
    apis.push(module);
  }
  return apis;
};
const registerAllInvokeApi = async () => {
  const allModules = await getApiModules(
    true,
    IS_PLAYGROUND_ENV
  );
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
    getApiModules,
  };
};
export const getInvokeApiMethods = () => {
  return builtInApi;
};
