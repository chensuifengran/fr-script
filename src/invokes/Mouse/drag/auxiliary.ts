
export const auxiliary = <AuxiliaryType>{
  //快速编辑/修改参数弹窗打开时触发
  onDialogOpen: async (_close,...args) => {
    const params = await AutoTipUtils.paramsProcess(...args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "drag" && i.scope === "Mouse"
    );
    const dialog = selfModule!.testModule!.dialog;
    dialog.args!.forEach((i, index) => {
      i.value = +params[index]?.value || 0;
    });
  },
  //参数处理方法
  parameterReplace: (options: {
    x: number;
    y: number;
    toX: number;
    toY: number;
    duration?: number;
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    if (options.duration && options.duration > 0) {
      options.replaceCurFnArgs(`${options.x}, ${options.y}, ${options.toX}, ${options.toY}, ${options.duration}`);
      return;
    }
    options.replaceCurFnArgs(`${options.x}, ${options.y}, ${options.toX}, ${options.toY}`);
  },
};