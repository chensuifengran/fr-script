import { auxiliary } from "./auxiliary";
import { upFn } from "./exportFn";

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
  console.time("up耗时");
  await upFn(options.x, options.y, options.button);
  console.timeEnd("up耗时");
  testModuleCtx.showDetails(`鼠标按键抬起完成`, "up");
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "up" && i.scope === "Mouse"
  )?.testModule!;
  selfModule.document!.example!.code = `await Mouse.up(${options.x}, ${
    options.y
  }, '${options.button || "left"}');`;
};
