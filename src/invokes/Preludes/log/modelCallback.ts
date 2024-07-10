import { auxiliary } from "./auxiliary";

export const modelCallback = async (
  options: {
    msg: string;
    type: string;
    replaceCurFnArgs?: (targetArgs: string) => void;
  },
  testModuleCtx: {
    showDetails: showDetailsFn;
  }
) => {
  if (options.replaceCurFnArgs) {
    const res = auxiliary.parameterReplace(options);
    AutoTipUtils.apiAutoTip();
    return res;
  }
  testModuleCtx.showDetails(
    "此方法无法直接调用，请在脚本中使用！",
    "Preludes.log"
  );
};
