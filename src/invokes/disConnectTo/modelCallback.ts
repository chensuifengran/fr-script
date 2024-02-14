import { disConnectToFn } from "./exportFn";
import { auxiliary } from "./auxiliary";
const { getInvokeApiMethods } = useInvokeApiMethodsRegister();

export const modelCallback = async (
  options: {
    targetDevice: string;
    replaceCurFnArgs?: (targetArgs: string) => void;
  },
  testModuleCtx: {
    showDetails: (text: string | undefined, preStr?: string) => void;
  }
) => {
  if (options.replaceCurFnArgs) {
    return auxiliary.parameterReplace(options);
  }
  console.time("断开连接设备耗时");
  const res = await disConnectToFn(options.targetDevice);
  console.timeEnd("断开连接设备耗时");
  testModuleCtx.showDetails(res);
  const selfModule = getInvokeApiMethods().find(
    (m) => m.name === "disConnectTo"
  )?.testModule;
  if (selfModule) {
    selfModule.document!.example!.code = codeHighLight(
      `const res = await disConnectTo('${options.targetDevice}');`
    );
  }
};
