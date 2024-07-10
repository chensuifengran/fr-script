import { auxiliary } from "./auxiliary";
import { clickerFn } from "./exportFn";


export const modelCallback = async (
  options: {
    duration: number;
    sleep: number;
    button: "left" | "right" | "middle";
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
    await new Promise((resolve) => {
      const t = setTimeout(() => {
        resolve(null);
        clearTimeout(t);
      }, options.delay);
    });
  }
  console.time("clicker耗时");
  await clickerFn(options.duration, options.sleep, options.button);
  console.timeEnd("clicker耗时");
  testModuleCtx.showDetails(`点击完成`, "clicker");
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "clicker" && i.scope === "Mouse"
  )?.testModule!;
  if (options.button === "left") {
    selfModule.document!.example!.code = codeHighLight(
      `await Mouse.clicker(${options.duration}, ${options.sleep});`
    );
  } else {
    selfModule.document!.example!.code = codeHighLight(
      `await Mouse.clicker(${options.duration}, ${options.sleep}, '${options.button}');`
    );
  }
};
