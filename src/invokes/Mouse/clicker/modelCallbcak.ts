import { auxiliary } from "./auxiliary";
import { clickerFn } from "./exportFn";
const { getInvokeApiMethods } = useInvokeApiMethodsRegister();

export const modelCallback = async (
  options: {
    duration: number;
    sleep: number;
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
    await new Promise((resolve) => {
      const t = setTimeout(() => {
        resolve(null);
        clearTimeout(t);
      }, options.delay);
    });
  }
  console.time("clicker耗时");
  await clickerFn(options.duration, options.sleep);
  console.timeEnd("clicker耗时");
  testModuleCtx.showDetails(`点击完成`, "clicker");
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "clicker" && i.scope === "Mouse"
  )?.testModule!;
  selfModule.document!.example!.code = codeHighLight(
    `await Mouse.clicker(${options.duration}, ${options.sleep});`
  );
};
