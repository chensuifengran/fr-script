export const auxiliary = <AuxiliaryType>{
  //快速编辑/修改参数弹窗打开时触发
  onDialogOpen: async (_close,...args) => {
    const params = await AutoTipUtils.paramsProcess(...args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "up" && i.scope === "Mouse"
    );
    const dialog = selfModule!.testModule!.dialog;
    dialog.args!.forEach((i, index) => {
      switch (index) {
        case 0:
        case 1:
        case 3:
          i.value = +params[index]?.value || 0;
          break;
        case 2:
          if (i.componentType === "select") {
            i.value = params[index]?.value || "left";
          }
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
