import { auxiliary } from "./auxiliary";
import { clickFn } from "./exportFn";

export const modelCallback = async (
  options: {
    x: number;
    y: number;
    button: "left" | "middle" | "right";
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
  console.time("click耗时");
  await clickFn(options.x, options.y, options.button);
  console.timeEnd("click耗时");
  testModuleCtx.showDetails(`点击完成`, "click");
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "click" && i.scope === "Mouse"
  )?.testModule!;
  selfModule.document!.example!.code = `await Mouse.click(${options.x}, ${
    options.y
  }, '${options.button || "left"}');`;
};
