import { auxiliary } from "./auxiliary";
import { keyUpFn } from "./exportFn";


export const modelCallback = async (
  options: {
    key: Key;
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
  console.time("keyUp耗时");
  const res = await keyUpFn(options.key);
  console.timeEnd("keyUp耗时");
  testModuleCtx.showDetails(JSON.stringify(res), "keyUp");
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "keyUp" && i.scope === "Input"
  )?.testModule!;
  selfModule.document!.example!.code = codeHighLight(
    `await Input.keyUp('${options.key}');`
  );
};
