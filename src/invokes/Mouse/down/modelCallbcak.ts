import { auxiliary } from "./auxiliary";
import { downFn } from "./exportFn";

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
  console.time("down耗时");
  await downFn(options.x, options.y, options.button);
  console.timeEnd("down耗时");
  testModuleCtx.showDetails(`鼠标按键按下完成`, "down");
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "down" && i.scope === "Mouse"
  )?.testModule!;
  selfModule.document!.example!.code = `await Mouse.down(${options.x}, ${
    options.y
  }, '${options.button || "left"}');`;
};
