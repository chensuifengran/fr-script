import { auxiliary } from "./auxiliary";
import { dirnameFn } from "./exportFn";
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
  console.time("dirname耗时");
  const res = await dirnameFn(path);
  console.timeEnd("dirname耗时");
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "dirname" && i.scope === "Path"
  )?.testModule!;
  //修改示例代码
  selfModule.document!.example!.code = `const res = await dirname(${path.replace(
    /\\/g,
    "\\\\"
  )})`;
  testModuleCtx.showDetails(JSON.stringify(res), "Path.dirname");
};
