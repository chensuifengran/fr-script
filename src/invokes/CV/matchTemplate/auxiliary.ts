export const auxiliary = <AuxiliaryType>{
  //快速编辑/修改参数弹窗打开时触发
  onDialogOpen: async (_close,...args) => {
    const params = await AutoTipUtils.paramsProcess(...args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "matchTemplate" && i.scope === "CV"
    );
    const dialog = selfModule!.testModule!.dialog;
    dialog.args!.forEach((i, index) => {
      switch (index) {
        case 0:
        case 1:
          if (i.componentType === "FileInput") {
            i.value = AutoTipUtils.pathStrReset(params[index]?.value || "");
          }
          break;
        case 2:
        case 3:
          if (i.componentType === "slider") {
            i.value = +params[index]?.value || 0;
          }
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
      `${AutoTipUtils.replaceConstantPath(
        options.imgPath
      )},${AutoTipUtils.replaceConstantPath(options.tempPath)},${
        options.exactValue
      },${options.scale}`
    );
  },
};
