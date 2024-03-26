import { auxiliary } from "./auxiliary";
import { screenColorFn } from "./exportFn";


export const modelCallback = async (
  options: {
    x: number;
    y: number;
    delay: number;
    replaceCurFnArgs?: (targetArgs: string) => void;
  },
  testModuleCtx: {
    showDetails: (text: string | undefined, preStr?: string) => void;
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
  console.time("screenColor耗时");
  const res = await screenColorFn(options.x, options.y);
  console.timeEnd("screenColor耗时");
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "screenColor"
  )?.testModule;

  selfModule!.document!.example!.code = codeHighLight(
    `const colorUtil = await screenColor(${options.x}, ${options.y});`
  );
  testModuleCtx.showDetails(res && JSON.stringify(res), "screenColor");
};
