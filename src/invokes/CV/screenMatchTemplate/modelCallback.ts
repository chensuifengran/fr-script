import { auxiliary } from "./auxiliary";
import { screenMatchTemplateFn } from "./exportFn";

export const modelCallback = async (
  options: {
    range: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    tempPath: string;
    exactValue: number;
    scale: number;
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
  const { range, tempPath, exactValue, scale } = options;
  const { showDetails } = testModuleCtx;
  console.time("screenMatchTemplate耗时");
  const res = await screenMatchTemplateFn(
    range.x,
    range.y,
    range.width,
    range.height,
    tempPath,
    exactValue,
    scale
  );
  console.timeEnd("screenMatchTemplate耗时");
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "screenMatchTemplate" && i.scope === "CV"
  )?.testModule!;
  selfModule.document!.example!.code = `const { x, y } = await 
        \tCV.screenMatchTemplate(${JSON.stringify(range)}, "${tempPath.replace(
    /\\/g,
    "\\\\"
  )}", ${exactValue}, ${scale});`;
  showDetails(JSON.stringify(res), "screenMatchTemplate");
};
