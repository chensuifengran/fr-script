const { getInvokeApiMethods } = useInvokeApiMethodsRegister();
export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args: string[]) => {
    const params = await AutoTipUtils.paramsProcess(args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "matchTemplate" && i.scope === "CV"
    );
    selfModule!.testModule!.dialog.args!.forEach((i, index) => {
      switch (index) {
        case 0:
        case 1:
          i.value = AutoTipUtils.pathStrReset(params[index] || "");
          break;
        case 2:
        case 3:
          i.value = +params[index] || 0;
          break;

        default:
          break;
      }
    });
  },
  //参数处理方法
  parameterReplace: (options: {
    imgPath: string;
    tempPath: string;
    exactValue: number;
    scale: number;
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    options.replaceCurFnArgs(
      `"${AutoTipUtils.pathStrProcess(
        options.imgPath
      )}","${AutoTipUtils.pathStrProcess(options.tempPath)}",${
        options.exactValue
      },${options.scale}`
    );
  },
};