import { auxiliary } from "./auxiliary";
import { writeFileFn } from "./exportFn";
export const modelCallback = async (
  options: {
    path: string;
    content: string;
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
  const { path, content } = options;
  console.time("writeFile耗时");
  const res = await writeFileFn(path, content);
  console.timeEnd("writeFile耗时");
  const selfModule = getInvokeApiMethods().find((i) => i.name === "writeFile" && i.scope === "FS")?.testModule!;
  //修改示例代码
  selfModule.document!.example!.code = `const res = await writeFile(${path.replace(
    /\\/g,
    "\\\\"
  )}, ${content.replace(/\\/g, "\\\\")});`;
  testModuleCtx.showDetails(JSON.stringify(res), "FS.writeFile");
};
