import { touchFn } from "./exportFn";
import { auxiliary } from "./auxiliary";

const { getInvokeApiMethods } = useInvokeApiMethodsRegister();

export const modelCallback = async (
  options: {
    targetX: number;
    targetY: number;
    replaceCurFnArgs?: (targetArgs: string) => void;
  },
  testModuleCtx: {
    showDetails: (text: string | undefined, preStr?: string) => void;
  }
) => {
  if (options.replaceCurFnArgs) {
    return auxiliary.parameterReplace(options);
  }
  console.time("点击指定位置耗时");
  const res = await touchFn(options.targetX, options.targetY);
  console.timeEnd("点击指定位置耗时");
  testModuleCtx.showDetails(res);
  const selfModule = getInvokeApiMethods().find(
    (m) => m.name === "touch"
  )?.testModule;
  if (selfModule) {
    selfModule.document!.example!.code = codeHighLight(
      `const res = await touch(${options.targetX}, ${options.targetY});`
    );
  }
};
