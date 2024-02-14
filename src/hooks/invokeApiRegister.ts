// const {registerAllInvokeApi} = invokeApiRegisterManager();

import { AllInvokeApiFn } from "../invokes/invokeApiRegisterManager";

//弹窗
const dialogModule = reactive({
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
const getTestModuleCtx = () => {
  return testModuleCtx;
};
const invokeApiMethods = reactive<InvokeApiMethodType[]>([]);
//设置testModuleCtx
const setTestModuleCtx = (ct: {
  showDetails: (text: string | undefined, preStr?: string) => void;
}) => {
  testModuleCtx.showDetails = ct.showDetails;
};
const getInvokeApiMethods = () => {
  return invokeApiMethods;
};

const getInvokeApiDialogModule = () => {
  return dialogModule;
};

const getInvokeApiTestModules = () => {
  return invokeApiMethods.map((i) => i.testModule);
};

const registerInvokeApiMethods = (
  methods: InvokeApiMethodType[] | InvokeApiMethodType
) => {
  if (methods instanceof Array) {
    methods.forEach((invokeApiMethod) => {
      const targetMethod = invokeApiMethods.find(
        (i) => i.name === invokeApiMethod.name
      );
      if (!/^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(invokeApiMethod.name)) {
        throw new Error(`methods中的name不符合js变量命名规范`);
      }
      if (targetMethod) {
        console.warn("已存在同名方法，跳过注册");
        return;
      }
      invokeApiMethods.push(invokeApiMethod);
    });
  } else {
    const targetMethod = invokeApiMethods.find((i) => i.name === methods.name);
    if (!/^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(methods.name)) {
      throw new Error(`methods中的name不符合js变量命名规范`);
    }
    if (targetMethod) {
      console.warn("已存在同名方法，跳过注册");
      return;
    }
    invokeApiMethods.push(methods);
  }
  console.log("invokeApiMethods", invokeApiMethods);
  
};

const invokeDialog = (
  methodName: string,
  title?: string,
  content?: string,
  callType: "test" | "changeArgs" = "test",
  replaceCurFnArgs?: (targetArgs: string) => void,
  currentParams?: string[]
) => {
  const targetMethod = invokeApiMethods.find(
    (i) => i.name === methodName || i.exportFn?.alias === methodName
  );
  if (title && content) {
    dialogModule.title = title;
    dialogModule.content = content;
    dialogModule.show = true;
    dialogModule.callType = callType;
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
        for (
          let i = 0;
          i < targetMethod!.testModule!.dialog.args!.length;
          i++
        ) {
          const arg = targetMethod!.testModule!.dialog.args![i];
          if (!arg.onlyTest || (arg.onlyTest && callType === "test")) {
            callArgsObject[arg.name] = arg.value;
          }
        }
        targetMethod!.testModule!.callback(callArgsObject, testModuleCtx);
        dialogModule.show = false;
      };
      dialogModule.callback = cb;
    } else {
      targetMethod!.testModule!.callback(undefined, testModuleCtx);
    }
  }
};

const exportAllFn = (): AllInvokeApiFn => {
  const allFn: ExportFns = {};
  invokeApiMethods.forEach((i) => {
    if (!i.exportFn) {
      return;
    }
    const { alias, fn } = i.exportFn;
    if (alias && !allFn[alias]) {
      allFn[alias] = fn;
    } else {
      allFn[i.name] = fn;
    }
  });
  return allFn as AllInvokeApiFn;
};

const getInvokeApiFnProxyStrings = (runId: string) => {
  return invokeApiMethods
    .map((i) => {
      const name = i.exportFn?.alias || i.name;
      if (i.testModule?.document?.params) {
        const params = i.testModule.document.params
          .map((i) => i.name)
          .join(",");
        return `
        const ${name} = async (${params}) => {
          if(window.runTimeApi.isStop) throw new Error("任务已结束");
          const result = await window.runTimeApi.${name}(${params}, '${runId}');
          return result;
        }
      `;
      } else {
        return `
        const ${name} = async () => {
          if(window.runTimeApi.isStop) throw new Error("任务已结束");
          const result = await window.runTimeApi.${name}('${runId}');
          return result;
        }
      `;
      }
    })
    .join("\n");
};
export const useInvokeApiMethodsRegister = () => {
  return {
    getInvokeApiFnProxyStrings,
    getInvokeApiMethods,
    getInvokeApiDialogModule,
    getInvokeApiTestModules,
    registerInvokeApiMethods,
    setTestModuleCtx,
    getTestModuleCtx,
    invokeDialog,
    exportAllFn,
  };
};
