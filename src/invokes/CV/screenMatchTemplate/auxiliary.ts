export const auxiliary = <AuxiliaryType>{
  //快速编辑/修改参数弹窗打开时触发
  onDialogOpen: async (_close, ...args) => {
    const params = await AutoTipUtils.paramsProcess(...args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "screenMatchTemplate" && i.scope === "CV"
    );
    const dialog = selfModule!.testModule!.dialog;
    dialog.args!.forEach((i, index) => {
      switch (index) {
        case 0:
          if (i.componentType === "rectInput") {
            i.value.x = +params[0]?.value || 0;
            i.value.y = +params[1]?.value || 0;
            i.value.width = +params[2]?.value || 0;
            i.value.height = +params[3]?.value || 0;
          }
          break;
        case 1:
          if (i.componentType === "fileInput") {
            i.value = AutoTipUtils.pathStrReset(params[4]?.value || "");
          }
          break;
        case 2:
        case 3:
          if (i.componentType === "slider") {
            i.value = +params[index + 3]?.value || 0;
          }
          break;
        case 4:
          if (i.componentType === "select") {
            i.value = params[7]?.value
              ? params[7]?.value?.toUpperCase()
              : "auto";
          }
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
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    options.replaceCurFnArgs(
      `${options.range.x}, ${options.range.y}, ${options.range.width}, ${
        options.range.height
      }, ${AutoTipUtils.replaceConstantPath(options.tempPath)}, ${
        options.exactValue
      }, ${options.scale}`
    );
  },
};
