import { auxiliary } from "./auxiliary";
import { readDirFn } from "./exportFn";
export const modelCallback = async (
  options: {
    path: string;
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
  const { path } = options;
  console.time("readDir耗时");
  const res = await readDirFn(path);
  console.timeEnd("readDir耗时");
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "readDir" && i.scope === "FS"
  )?.testModule!;
  //修改示例代码
  selfModule.document!.example!.code = `const files = await readDir("${path.replace(
    /\\/g,
    "\\\\"
  )}");`;
  testModuleCtx.showDetails(JSON.stringify(res), "FS.readDir");
};
