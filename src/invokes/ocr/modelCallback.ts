import { auxiliary } from "./auxiliary";
import { ocrFn } from "./exportFn";
const { getInvokeApiMethods } = useInvokeApiMethodsRegister();
export const modelCallback = async (
  options: {
    rect: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    imgPath: string;
    replaceCurFnArgs?: (targetArgs: string) => void;
  },
  testModuleCtx: {
    showDetails: (text: string | undefined, preStr?: string) => void;
  }
) => {
  if (options.replaceCurFnArgs) {
    return auxiliary.parameterReplace(options);
  }
  const { imgPath, rect } = options;
  console.time("ocr耗时");
  const res = await ocrFn(rect.x, rect.y, rect.width, rect.height, imgPath);
  console.timeEnd("ocr耗时");
  const selfModule = getInvokeApiMethods().find((i) => i.name === "ocr")
    ?.testModule!;
  if (options.imgPath === "") {
    selfModule.document!.example!.code = codeHighLight(
      `const result = await ocr(${rect.x}, ${rect.y}, ${rect.width}, ${rect.height});`
    );
  } else {
    selfModule.document!.example!.code = codeHighLight(
      `const result = await ocr(${rect.x}, ${rect.y}, ${rect.width}, ${
        rect.height
      }, "${imgPath.replace(/\\/g, "\\\\")}");`
    );
  }

  testModuleCtx.showDetails(JSON.stringify(res), "ocr");
};
