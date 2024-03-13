import { auxiliary } from "./auxiliary";
import { wheelFn } from "./exportFn";
const { getInvokeApiMethods } = useInvokeApiMethodsRegister();

export const modelCallback = async (
  options: {
    delta: number;
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
  console.time("wheel耗时");
  const res:any = await wheelFn(options.delta);
  console.timeEnd("wheel耗时");
  testModuleCtx.showDetails(res || "OK", "wheel");
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "wheel" && i.scope === "Mouse"
  )?.testModule!;
  selfModule.document!.example!.code = codeHighLight(
    `await Mouse.wheel(${options.delta}');`
  );
};
