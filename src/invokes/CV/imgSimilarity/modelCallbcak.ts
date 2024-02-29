import { imgSimilarityFn } from "./exportFn";

import { auxiliary } from "./auxiliary";
const { getInvokeApiMethods } = useInvokeApiMethodsRegister();

export const modelCallback = async (
  options: {
    imgPath: string;
    tempPath: string;
    rect: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    replaceCurFnArgs?: (targetArgs: string) => void;
  },
  testModuleCtx: {
    showDetails: (text: string | undefined, preStr?: string) => void;
  }
) => {
  if (options.replaceCurFnArgs) {
    return auxiliary.parameterReplace(options);
  }
  console.time("imgSimilarity耗时");
  const similarityValue = await imgSimilarityFn(
    options.imgPath,
    options.tempPath,
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
        \t"${options.imgPath.replace(/\\/g, "\\\\")}",
        \t"${options.tempPath.replace(/\\/g, "\\\\")}",
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
