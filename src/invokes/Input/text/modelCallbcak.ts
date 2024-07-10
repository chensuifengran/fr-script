import { auxiliary } from "./auxiliary";
import { textFn } from "./exportFn";


export const modelCallback = async (
  options: {
    text: string;
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
  console.time("text耗时");
  const res = await textFn(options.text);
  console.timeEnd("text耗时");
  testModuleCtx.showDetails(JSON.stringify(res), "text");
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "text" && i.scope === "Input"
  )?.testModule!;
  selfModule.document!.example!.code = codeHighLight(
    `await Input.text('${options.text}');`
  );
};
