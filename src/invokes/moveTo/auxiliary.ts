const { getInvokeApiMethods } = useInvokeApiMethodsRegister();
export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args: string[]) => {
    const params = await AutoTipUtils.paramsProcess(args);
    const selfModule = getInvokeApiMethods().find((i) => i.name === "moveTo");
    selfModule!.testModule!.dialog.args!.forEach((i, index) => {
      switch (index) {
        case 0:
          i.value = AutoTipUtils.pathStrReset(params[0] || "");
          break;
        case 1:
          i.value = AutoTipUtils.pathStrReset(params[1] || "");
          break;
        case 2:
          i.value = AutoTipUtils.pathStrReset(params[2][0] || "[0,0]");
          break;
        case 3:
          i.value = AutoTipUtils.pathStrReset(params[2][1] || "[0,0]");
          break;
        default:
          break;
      }
    });
  },
  //参数处理方法
  parameterReplace: (options: {
    x: number;
    y: number;
    randomRange: [[number, number], [number, number]];
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    options.replaceCurFnArgs(
      `"${options.x}", "${options.y}", "${JSON.stringify(options.randomRange)}"`
    );
  },
};
