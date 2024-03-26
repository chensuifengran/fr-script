

export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args: string[]) => {
    const params = await AutoTipUtils.paramsProcess(args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "click" && i.scope === "Mouse"
    );
    const dialog = selfModule!.testModule!.dialog;
    dialog.args!.forEach((i, index) => {
      switch (index) {
        case 0:
        case 1:
        case 3:
          i.value = +params[index] || 0;
          break;
        case 2:
          i.value = params[index] || "left";
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
    button?: "left" | "middle" | "right";
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    options.replaceCurFnArgs(
      `${options.x}, ${options.y}${
        options.button === undefined || options.button === "left"
          ? ""
          : ", '" + options.button + "'"
      }`
    );
  },
};
