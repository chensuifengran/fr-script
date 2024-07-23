import { auxiliary } from "./auxiliary";
import { screenshotColorFn } from "./exportFn";

export const modelCallback = async (
  options: {
    x: number;
    y: number;
    mod: "normal" | "adb";
    delay: number;
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
  if (options.delay > 0) {
    await new Promise<void>((resolve) => setTimeout(resolve, options.delay));
  }
  console.time("screenshotColor耗时");
  const res = await screenshotColorFn(options.x, options.y, options.mod);
  console.timeEnd("screenshotColor耗时");
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "screenshotColor"
  )?.testModule;

  if (options.mod === "adb") {
    selfModule!.document!.example!.code = `const colorUtil = await screenshotColor(${options.x}, ${options.y}, 'adb');`;
  } else {
    selfModule!.document!.example!.code = `const colorUtil = await screenshotColor(${options.x}, ${options.y});`;
  }
  testModuleCtx.showDetails(res && JSON.stringify(res), "screenshotColor");
};
