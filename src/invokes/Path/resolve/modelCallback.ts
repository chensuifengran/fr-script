import { auxiliary } from "./auxiliary";
import { resolveFn } from "./exportFn";
export const modelCallback = async (
  options: {
    path: string;
    addPath: string;
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
  const { path, addPath } = options;
  console.time("resolve耗时");
  const res = await resolveFn(path, addPath);
  console.timeEnd("resolve耗时");
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "resolve" && i.scope === "Path"
  )?.testModule!;
  //修改示例代码
  selfModule.document!.example!.code = `const newPath = await resolve(${path.replace(
    /\\/g,
    "\\\\"
  )}, ${addPath.replace(/\\/g, "\\\\")})`;
  testModuleCtx.showDetails(JSON.stringify(res), "Path.resolve");
};
