import { auxiliary } from "./auxiliary";
import { imgColorFn } from "./exportFn";
const { getInvokeApiMethods } = useInvokeApiMethodsRegister();

export const modelCallback = async (
  options: {
    path: string;
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
  console.time("imgColor耗时");
  const res = await imgColorFn(options.path, options.x, options.y);
  console.timeEnd("imgColor耗时");
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "imgColor"
  )?.testModule;

  selfModule!.document!.example!.code = codeHighLight(
    `const colorUtil = await imgColor(${options.path}, ${options.x}, ${options.y});`
  );
  testModuleCtx.showDetails(res && JSON.stringify(res), "imgColor");
};
