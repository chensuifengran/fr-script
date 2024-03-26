import { connectToFn } from "./exportFn";
import { auxiliary } from "./auxiliary";


export const modelCallback = async (
  options: {
    targetDevice: string;
    replaceCurFnArgs?: (targetArgs: string) => void;
  },
  testModuleCtx: {
    showDetails: (text: string | undefined, preStr?: string) => void;
  }
) => {
  if(options.replaceCurFnArgs) {
    const res = auxiliary.parameterReplace(options);
    AutoTipUtils.apiAutoTip();
    return res;
  }
  console.time("连接到指定设备耗时");
  const res = await connectToFn(options.targetDevice);
  console.timeEnd("连接到指定设备耗时");
  const selfModule = getInvokeApiMethods().find(
    (m) => m.name === "connectTo"
  )?.testModule;
  if (selfModule) {
    selfModule.document!.example!.code = codeHighLight(
      `const res = await connectTo('${options.targetDevice}');`
    );
  } else {
    console.error("找不到connectTo的testModule", getInvokeApiMethods());
  }
  testModuleCtx.showDetails(res);
};
