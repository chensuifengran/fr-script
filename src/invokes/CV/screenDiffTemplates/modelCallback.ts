import { auxiliary } from "./auxiliary";
import { screenDiffTemplatesFn } from "./exportFn";

export const modelCallback = async (
  options: {
    range: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    tempPaths: string[];
    targetIndex: number;
    drive: string;
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
  const { range, tempPaths, targetIndex, drive } = options;
  const { showDetails } = testModuleCtx;
  console.time("screenDiffTemplates耗时");
  const res = await screenDiffTemplatesFn(
    range.x,
    range.y,
    range.width,
    range.height,
    tempPaths,
    targetIndex || 0,
    drive || "D"
  );
  console.timeEnd("screenDiffTemplates耗时");
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "screenDiffTemplates" && i.scope === "CV"
  )?.testModule!;
  selfModule.document!.example!.code = `const res = await CV.screenDiffTemplates(${JSON.stringify(
    range
  )}, ["${tempPaths.join('","').replace(/\\/g, "\\\\")}"], ${targetIndex}${
    drive === "auto" ? "" : `, "${drive}"`
  } );`;
  showDetails(JSON.stringify(res), "screenDiffTemplates");
};