

export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args: string[]) => {
    const params = await AutoTipUtils.paramsProcess(args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "imgSimilarity" && i.scope === "CV"
    );
    const dialog = selfModule!.testModule!.dialog;
    dialog.args!.forEach((i, index) => {
      switch (index) {
        case 0:
        case 1:
          i.value = AutoTipUtils.pathStrReset(params[index] || "");
          break;
        case 2:
          i.value.x = +params[2] || 0;
          i.value.y = +params[3] || 0;
          i.value.width = +params[4] || 0;
          i.value.height = +params[5] || 0;
          break;
        default:
          break;
      }
    });
  },
  //参数处理方法
  parameterReplace: (options: {
    pathA: string;
    pathB: string;
    rect: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    options.replaceCurFnArgs(
      `${AutoTipUtils.replaceConstantPath(
        options.pathA
      )},${AutoTipUtils.replaceConstantPath(options.pathB)},${options.rect.x},${
        options.rect.y
      },${options.rect.width},${options.rect.height}`
    );
  },
};
