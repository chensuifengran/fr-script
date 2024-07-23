import { cmdFn } from "./exportFn";
import { auxiliary } from "./auxiliary";

export const modelCallback = async (
  options: {
    command: string;
    onlyExec: boolean;
    replaceCurFnArgs?: (targetArgs: string) => void;
  },
  testModuleCtx: {
    showDetails: ShowDetailsFn;
  }
) => {
  if (options.replaceCurFnArgs) {
    const res = auxiliary.parameterReplace(options);
    AutoTipUtils.apiAutoTip();
    return res;
  }
  console.time("命令执行耗时");
  const res = await cmdFn(options.command, options.onlyExec);
  console.timeEnd("命令执行耗时");
  testModuleCtx.showDetails(res);
  const selfModule = getInvokeApiMethods().find(
    (m) => m.name === "cmd"
  )?.testModule;
  if (selfModule) {
    if (options.onlyExec) {
      selfModule.document!.example!.code = `const res = await cmd("${options.command}", true);`;
    } else {
      selfModule.document!.example!.code = `const res = await cmd("${options.command}");`;
    }
  }
};
