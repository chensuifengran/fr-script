import { auxiliary } from "./auxiliary";
import { readFileFn } from "./exportFn";
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
  console.time("readFile耗时");
  const res = await readFileFn(path);
  console.timeEnd("readFile耗时");
  const selfModule = getInvokeApiMethods().find((i) => i.name === "readFile" && i.scope === "FS")?.testModule!;
  //修改示例代码
  selfModule.document!.example!.code = `const content = await readFile(path);`;
  testModuleCtx.showDetails(JSON.stringify(res), "FS.readFile");
};
