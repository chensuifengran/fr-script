export const auxiliary = <AuxiliaryType>{
  //快速编辑/修改参数弹窗打开时触发
  onDialogOpen: async (_close, ...args) => {
    const params = await AutoTipUtils.paramsProcess(...args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "imgSimilarity" && i.scope === "CV"
    );
    const dialog = selfModule!.testModule!.dialog;
    dialog.args!.forEach((i, index) => {
      switch (index) {
        case 0:
        case 1:
          if (i.componentType === "fileInput") {
            i.value = AutoTipUtils.pathStrReset(params[index]?.value || "");
          }
          break;
        case 2:
          if (i.componentType === "rectInput") {
            i.value.x = +params[2]?.value || 0;
            i.value.y = +params[3]?.value || 0;
            i.value.width = +params[4]?.value || 0;
            i.value.height = +params[5]?.value || 0;
          }
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
