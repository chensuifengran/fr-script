import { auxiliary } from "./auxiliary";
import { basenameFn } from "./exportFn";
export const modelCallback = async (
  options: {
    path: string;
    ext: string;
    replaceCurFnArgs?: (targetArgs: string) => void;
  },
  testModuleCtx: {
    showDetails: ShowDetailsFn;
  }
) => {
  if (options.replaceCurFnArgs) {
    //快速填写或修改方法参数弹窗点击确定时
    auxiliary.parameterReplace(options);
    AutoTipUtils.apiAutoTip();
    return;
  }
  //测试调用时
  const { path, ext } = options;
  console.time("basename耗时");
  const res = await basenameFn(path, ext);
  console.timeEnd("basename耗时");
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "basename" && i.scope === "Path"
  )?.testModule!;
  //修改示例代码
  selfModule.document!.example!.code = `const res = await basename("${path.replace(
    /\\/g,
    "\\\\"
  )}"${ext ? `, "${ext}"` : ``});`;
  testModuleCtx.showDetails(JSON.stringify(res), "Path.basename");
};
