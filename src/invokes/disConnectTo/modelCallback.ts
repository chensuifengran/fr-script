import { disConnectToFn } from "./exportFn";
import { auxiliary } from "./auxiliary";


export const modelCallback = async (
  options: {
    targetDevice: string;
    replaceCurFnArgs?: (targetArgs: string) => void;
  },
  testModuleCtx: {
    showDetails: ShowDetailsFn;
  }
) => {
  if (options.replaceCurFnArgs) {
    const res = auxiliary.parameterReplace(options);
    AutoTipUtils.apiAutoTip();
    return res;
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
