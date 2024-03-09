import { cmdFn } from "./exportFn";
import { auxiliary } from "./auxiliary";

const { getInvokeApiMethods } = useInvokeApiMethodsRegister();

export const modelCallback = async (
  options: {
    command: string;
    onlyExec: boolean;
    replaceCurFnArgs?: (targetArgs: string) => void;
  },
  testModuleCtx: {
    showDetails: (text: string | undefined, preStr?: string) => void;
  }
) => {
  if (options.replaceCurFnArgs) {
    return auxiliary.parameterReplace(options);
  }
  console.time("命令执行耗时");
  const res = await cmdFn(options.command, options.onlyExec);
  console.timeEnd("命令执行耗时");
  testModuleCtx.showDetails(res);
  const selfModule = getInvokeApiMethods().find(
    (m) => m.name === "cmd"
  )?.testModule;
  if (selfModule) {
    if(options.onlyExec){
      selfModule.document!.example!.code = codeHighLight(
        `const res = await cmd("${options.command}", true);`
      );
    }else{
      selfModule.document!.example!.code = codeHighLight(
        `const res = await cmd("${options.command}");`
      );
    }
  }
};
