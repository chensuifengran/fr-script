import { auxiliary } from "./auxiliary";
import { matchTemplateFn } from "./exportFn";
const { getInvokeApiMethods } = useInvokeApiMethodsRegister();
export const modelCallback = async (
  options: {
    imgPath: string;
    tempPath: string;
    exactValue: number;
    scale: number;
    replaceCurFnArgs?: (targetArgs: string) => void;
  },
  testModuleCtx: {
    showDetails: (text: string | undefined, preStr?: string) => void;
  }
) => {
  if (options.replaceCurFnArgs) {
    return auxiliary.parameterReplace(options);
  }
  const { imgPath, tempPath, exactValue, scale } = options;
  const { showDetails } = testModuleCtx;
  console.time("matchTemplate耗时");
  const res = await matchTemplateFn(imgPath, tempPath, exactValue, scale);
  console.timeEnd("matchTemplate耗时");
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "matchTemplate" && i.scope === "CV"
  )?.testModule!;
  selfModule.document!.example!.code = codeHighLight(
    `const { x, y } = await 
        \tCV.matchTemplate("${imgPath.replace(
          /\\/g,
          "\\\\"
        )}", "${tempPath.replace(/\\/g, "\\\\")}", ${exactValue}, ${scale});`
  );
  showDetails(JSON.stringify(res), "matchTemplate");
};
