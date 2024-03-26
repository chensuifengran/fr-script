import { slideToFn } from "./exportFn";
import { auxiliary } from "./auxiliary";


export const modelCallback = async (
  options: {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    slideTime: number;
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
  console.time("滑动耗时");
  const res = await slideToFn(
    options.fromX,
    options.fromY,
    options.toX,
    options.toY,
    options.slideTime
  );
  console.timeEnd("滑动耗时");
  testModuleCtx.showDetails(res);
  const selfModule = getInvokeApiMethods().find(
    (m) => m.name === "slideTo"
  )?.testModule;
  if (selfModule) {
    selfModule.document!.example!.code = codeHighLight(
      `const res = await slideTo(${options.fromX}, ${options.fromY}, ${options.toX}, ${options.toY}, ${options.slideTime});`
    );
  }
};
