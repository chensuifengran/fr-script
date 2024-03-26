

export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args: string[]) => {
    const params = await AutoTipUtils.paramsProcess(args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "cropPicture"
    );
    const dialog = selfModule!.testModule!.dialog;
    dialog.args!.forEach((i, index) => {
      switch (index) {
        case 0:
          i.value = AutoTipUtils.pathStrReset(params[0] || "");
          break;
        case 1:
          i.value.x = +params[1] || 0;
          i.value.y = +params[2] || 0;
          i.value.width = +params[3] || 0;
          i.value.height = +params[4] || 0;
          break;
        case 2:
          i.value = AutoTipUtils.pathStrReset(params[5] || "");
          break;
        default:
          break;
      }
    });
  },
  //参数处理方法
  parameterReplace: (options: {
    path: string;
    range: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    outPath: string;
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    options.replaceCurFnArgs(
      `${AutoTipUtils.replaceConstantPath(options.path)},${options.range.x},${
        options.range.y
      },${options.range.width},${
        options.range.height
      },${AutoTipUtils.replaceConstantPath(options.outPath)}`
    );
  },
};
