import { auxiliary } from "./auxiliary";
import { renameFn } from "./exportFn";
export const modelCallback = async (
  options: {
    oldPath: string;
    newPath: string;
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
  const { oldPath, newPath } = options;
  console.time("rename耗时");
  const res = await renameFn(oldPath, newPath);
  console.timeEnd("rename耗时");
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "rename" && i.scope === "FS"
  )?.testModule!;
  //修改示例代码
  selfModule.document!.example!.code = `const res = await rename("${oldPath.replace(
    /\\/g,
    "\\\\"
  )}", "${newPath.replace(/\\/g, "\\\\")}")`;
  testModuleCtx.showDetails(JSON.stringify(res), "FS.rename");
};
