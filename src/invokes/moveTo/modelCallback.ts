import { moveToFn } from "./exportFn";

import { auxiliary } from "./auxiliary";
const { getInvokeApiMethods } = useInvokeApiMethodsRegister();
export const modelCallback = async (
  options: {
    x: number;
    y: number;
    xRandomRange: [number, number];
    yRandomRange: [number, number];
    replaceCurFnArgs?: (targetArgs: string) => void;
  },
  testModuleCtx: {
    showDetails: (text: string | undefined, preStr?: string) => void;
  }
) => {
  if (options.replaceCurFnArgs) {
    return auxiliary.parameterReplace(options);
  }
  console.time("moveTo");
  const res = await moveToFn(options.x, options.y, [
    options.xRandomRange,
    options.yRandomRange,
  ]);
  console.timeEnd("moveTo");
  testModuleCtx.showDetails(res);
  const selfModule = getInvokeApiMethods().find(
    (m) => m.name === "moveTo"
  )?.testModule;
  if (selfModule) {
    selfModule.document!.example!.code = codeHighLight(
      `const res = await moveTo(${options.x}, ${options.y}, [[${options.xRandomRange[0]}, ${options.xRandomRange[1]}], [${options.yRandomRange[0]}, ${options.yRandomRange[1]}]]);`.replace(', [[0, 0], [0, 0]]','')
    );
  }
};
