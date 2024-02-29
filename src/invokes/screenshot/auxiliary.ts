const { getInvokeApiMethods } = useInvokeApiMethodsRegister();

export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args: string[]) => {
    const params = await AutoTipUtils.paramsProcess(args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "screenshot"
    );
    selfModule!.testModule!.dialog.args!.forEach((i, index) => {
      switch (index) {
        case 0:
          i.value = AutoTipUtils.pathStrReset(params[4] || "");
          break;
        case 1:
          i.value =
            (params[0] &&
              params[1] &&
              params[2] &&
              params[3] &&
              !(
                +params[0] === -1 ||
                +params[1] === -1 ||
                +params[2] === -1 ||
                +params[3] === -1
              )) ||
            false;
          break;
        case 2:
          i.value.x = +params[0] >= 0 ? +params[0] : -1;
          i.value.y = +params[1] >= 0 ? +params[1] : -1;
          i.value.width = +params[2] || -1;
          i.value.height = +params[3] || -1;
          break;
        default:
          break;
      }
    });
  },
  //参数处理方法
  parameterReplace: (options: {
    path: string;
    selectRange: boolean;
    range: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    if (!options.selectRange && options.path === "") {
      options.replaceCurFnArgs(``);
    } else if (!options.selectRange) {
      options.replaceCurFnArgs(
        `-1,-1,-1,-1, "${AutoTipUtils.pathStrProcess(options.path)}"`
      );
    } else if (options.path === "") {
      options.replaceCurFnArgs(
        `${options.range.x},${options.range.y},${options.range.width},${options.range.height}`
      );
    } else {
      options.replaceCurFnArgs(
        `${
          options.range.x +
          "," +
          options.range.y +
          "," +
          options.range.width +
          "," +
          options.range.height
        }, "${AutoTipUtils.pathStrProcess(options.path)}"`
      );
    }
  },
};
