export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args) => {
    const params = await AutoTipUtils.paramsProcess(...args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "screenshot"
    );
    const dialog = selfModule!.testModule!.dialog;
    dialog.args!.forEach((i, index) => {
      switch (index) {
        case 0:
          i.value = AutoTipUtils.pathStrReset(params[4]?.value || "");
          break;
        case 1:
          i.value =
            (params[0]?.value &&
              params[1]?.value &&
              params[2]?.value &&
              params[3]?.value &&
              !(
                +params[0]?.value === -1 ||
                +params[1]?.value === -1 ||
                +params[2]?.value === -1 ||
                +params[3]?.value === -1
              )) ||
            false;
          break;
        case 2:
          if (i.componentType === "RectInput") {
            i.value.x = +params[0]?.value >= 0 ? +params[0]?.value : -1;
            i.value.y = +params[1]?.value >= 0 ? +params[1]?.value : -1;
            i.value.width = +params[2]?.value || -1;
            i.value.height = +params[3]?.value || -1;
          }
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
        `-1,-1,-1,-1, ${AutoTipUtils.replaceConstantPath(options.path)}`
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
        }, ${AutoTipUtils.replaceConstantPath(options.path)}`
      );
    }
  },
};
