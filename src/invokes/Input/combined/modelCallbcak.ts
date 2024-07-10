import { auxiliary } from "./auxiliary";
import { combinedFn } from "./exportFn";


export const modelCallback = async (
  options: {
    keys: Key[];
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
  console.time("combined耗时");
  const res = await combinedFn(options.keys);
  console.timeEnd("combined耗时");
  testModuleCtx.showDetails(JSON.stringify(res), "combined");
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "combined" && i.scope === "Input"
  )?.testModule!;
  selfModule.document!.example!.code = codeHighLight(
    `await Input.combined([${options.keys
      .map((key) => {
        return `'${key}'`;
      })
      .join(",")}]);`
  );
};
