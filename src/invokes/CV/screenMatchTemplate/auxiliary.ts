const { getInvokeApiMethods } = useInvokeApiMethodsRegister();
export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args: string[]) => {
    const params = await AutoTipUtils.paramsProcess(args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "screenMatchTemplate" && i.scope === "CV"
    );
    const dialog = selfModule!.testModule!.dialog;
    dialog.args!.forEach((i, index) => {
      switch (index) {
        case 0:
          i.value.x = +params[0] || 0;
          i.value.y = +params[1] || 0;
          i.value.width = +params[2] || 0;
          i.value.height = +params[3] || 0;
          break;
        case 1:
          i.value = AutoTipUtils.pathStrReset(params[4] || "");
          break;
        case 2:
          i.value = +params[5] || 0;
          break;
        case 3:
          i.value = +params[6] || 0;
          break;
        case 4:
          i.value = params[7] ? params[7].toUpperCase() : "auto";
          break;
        default:
          break;
      }
    });
  },
  //参数处理方法
  parameterReplace: (options: {
    range: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    tempPath: string;
    exactValue: number;
    scale: number;
    drive: string;
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    options.replaceCurFnArgs(
      `${options.range.x}, ${options.range.y}, ${options.range.width}, ${
        options.range.height
      }, ${AutoTipUtils.replaceConstantPath(options.tempPath)}, ${
        options.exactValue
      }, ${options.scale}${
        options.drive === "auto" ? "" : `, "${options.drive}"`
      }`
    );
  },
};
