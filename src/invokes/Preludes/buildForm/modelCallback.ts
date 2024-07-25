import { auxiliary } from "./auxiliary";
import { buildFormFn } from "./exportFn";
export const modelCallback = async (
  options: {
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
  const {  } = options;
  console.time("buildForm耗时");
  const res = await buildFormFn(/*参数*/);
  console.time("buildForm耗时");
  const selfModule = getInvokeApiMethods().find((i) => i.name === "buildForm" && i.scope === "Preludes")?.testModule!;
  //修改示例代码
  selfModule.document!.example!.code = `buildForm(/*参数*/);`;
  testModuleCtx.showDetails(JSON.stringify(res), "Preludes.buildForm");
};
