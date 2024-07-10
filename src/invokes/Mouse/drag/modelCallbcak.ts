import { auxiliary } from "./auxiliary";
import { dragFn } from "./exportFn";

export const modelCallback = async (
  options: {
    x: number;
    y: number;
    toX: number;
    toY: number;
    duration: number;
    delay?: number;
    replaceCurFnArgs?: (targetArgs: string) => void;
  },
  testModuleCtx: {
    showDetails: ShowDetailsFn;
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
    console.time("drag耗时");
    const res = await dragFn(options.x, options.y, options.toX, options.toY, options.duration);
    console.timeEnd("drag耗时");
    if(res !== undefined){
      testModuleCtx.showDetails(`鼠标拖动完成`, "Mouse.drag");
    }else{
      testModuleCtx.showDetails(`鼠标拖动完成`, "Mouse.drag");
    }
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "drag" && i.scope === "Mouse"
    )?.testModule;
    if(!selfModule){
      console.error('找不到selfModule');
      return
    }
    if(options.duration > 0){
      selfModule.document!.example!.code = codeHighLight(
        `await Mouse.drag(${options.x}, ${options.y}, ${options.toX}, ${options.toY}, ${options.duration});`
      );
    }else{
      selfModule.document!.example!.code = codeHighLight(
        `await Mouse.drag(${options.x}, ${options.y}, ${options.toX}, ${options.toY});`
      );
    }
  }
};
