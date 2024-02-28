import { auxiliary } from "./auxiliary";
import { moveFn } from "./exportFn";
const { getInvokeApiMethods } = useInvokeApiMethodsRegister();

export const modelCallback = async (
  options: {
    x: number;
    y: number;
    isRelative: boolean;
    delay?: number;
    replaceCurFnArgs?: (targetArgs: string) => void;
  },
  testModuleCtx: {
    showDetails: (text: string | undefined, preStr?: string) => void;
  }
) => {
  if (options.replaceCurFnArgs) {
    //快速修改编辑器参数
    auxiliary.parameterReplace(options);
  } else {
    //api调用测试
    if (options.delay! > 0) {
      await new Promise((resolve) => {
        const t = setTimeout(() => {
          resolve(null);
          clearTimeout(t);
        }, options.delay);
      });
    }
    console.time("move耗时");
    const res = await moveFn(options.x, options.y, options.isRelative);
    console.timeEnd("move耗时");
    if(res !== undefined){
      testModuleCtx.showDetails(`移动鼠标完成`, "Mouse.move");
    }else{
      testModuleCtx.showDetails(`移动鼠标失败`, "Mouse.move");
    }
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "move" && i.scope === "Mouse"
    )?.testModule;
    if(!selfModule){
      console.error('找不到selfModule');
      return
    }
    if(options.isRelative){
      selfModule.document!.example!.code = codeHighLight(
        `await Mouse.move(${options.x}, ${options.y}, true);`
      );
    }else{
      selfModule.document!.example!.code = codeHighLight(
        `await Mouse.move(${options.x}, ${options.y});`
      );
    }
  }
};
