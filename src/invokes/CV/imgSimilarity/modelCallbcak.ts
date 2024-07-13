import { imgSimilarityFn } from "./exportFn";

import { auxiliary } from "./auxiliary";


export const modelCallback = async (
  options: {
    pathA: string;
    pathB: string;
    rect: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
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
  console.time("imgSimilarity耗时");
  const similarityValue = await imgSimilarityFn(
    options.pathA,
    options.pathB,
    options.rect.x,
    options.rect.y,
    options.rect.width,
    options.rect.height
  );
  console.timeEnd("imgSimilarity耗时");
  const selfFnModule = getInvokeApiMethods().find(
    (i) => i.name === "imgSimilarity" && i.scope === "CV"
  )?.testModule;
  selfFnModule!.document!.example!.code = codeHighLight(
    `const similarityValue = await CV.imgSimilarity(
        \t"${options.pathA.replace(/\\/g, "\\\\")}",
        \t"${options.pathB.replace(/\\/g, "\\\\")}",
        \t${options.rect.x},${options.rect.y},${options.rect.width},${
      options.rect.height
    }
        );
      `
  );
  testModuleCtx.showDetails(
    `当前图片与模板的相似度：${similarityValue}`,
    "imgSimilarity"
  );
};
