import { auxiliary } from "./auxiliary";
import { getImageSizeFn } from "./exportFn";

export const modelCallback = async (
  //弹窗填写的参数
  options: { path: string; replaceCurFnArgs?: (targetArgs: string) => void },
  //DllTest组件的上下文
  testModuleCtx: {
    showDetails: ShowDetailsFn;
  }
) => {
  if (options.replaceCurFnArgs) {
    const res = auxiliary.parameterReplace(options);
    AutoTipUtils.apiAutoTip();
    return res;
  }
  console.time("getImageSize耗时");
  const { width, height } = await getImageSizeFn(options.path);
  console.timeEnd("getImageSize耗时");
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "getImageSize"
  )?.testModule;
  selfModule!.document!.example!.code = `const { width, height } = await getImageSize(\n\t"${options.path.replace(
    /\\/g,
    "\\\\"
  )}"\n);`;
  testModuleCtx.showDetails(
    "图片宽高：" + width + "x" + height,
    "getImageSize"
  );
};
