import { auxiliary } from "./auxiliary";
import { getImageSizeFn } from "./exportFn";
const { getInvokeApiMethods } = useInvokeApiMethodsRegister();

export const modelCallback = async (
  //弹窗填写的参数
  options: { path: string; replaceCurFnArgs?: (targetArgs: string) => void },
  //DllTest组件的上下文
  testModuleCtx: {
    showDetails: (text: string | undefined, preStr?: string) => void;
  }
) => {
  if (options.replaceCurFnArgs) {
    return auxiliary.parameterReplace(options);
  }
  console.time("getImageSize耗时");
  const { width, height } = await getImageSizeFn(options.path);
  console.timeEnd("getImageSize耗时");
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "getImageSize"
  )?.testModule;
  selfModule!.document!.example!.code = codeHighLight(
    `const { width, height } = await getImageSize(\n\t"${options.path.replace(
      /\\/g,
      "\\\\"
    )}"\n);`
  );

  testModuleCtx.showDetails(
    "图片宽高：" + width + "x" + height,
    "getImageSize"
  );
};