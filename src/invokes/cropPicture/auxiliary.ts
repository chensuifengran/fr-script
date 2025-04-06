export const auxiliary = <AuxiliaryType>{
  //快速编辑/修改参数弹窗打开时触发
  onDialogOpen: async (_close, ...args) => {
    const params = await AutoTipUtils.paramsProcess(...args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "cropPicture"
    );
    const dialog = selfModule!.testModule!.dialog;
    dialog.args!.forEach((i, index) => {
      if (index === 0) {
        if (i.componentType === "fileInput") {
          i.value = AutoTipUtils.pathStrReset(params[0]?.value || "");
        }
      } else if (index === 1) {
        if (i.componentType === "rectInput") {
          i.value.x = +params[1]?.value || 0;
          i.value.y = +params[2]?.value || 0;
          i.value.width = +params[3]?.value || 0;
          i.value.height = +params[4]?.value || 0;
        }
      } else if (index === 2) {
        if (i.componentType === "fileInput") {
          i.value = AutoTipUtils.pathStrReset(params[5]?.value || "");
        }
      }
    });
  },
  //参数处理方法
  parameterReplace: (options: {
    path: string;
    range: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    outPath: string;
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    options.replaceCurFnArgs(
      `${AutoTipUtils.replaceConstantPath(options.path)},${options.range.x},${
        options.range.y
      },${options.range.width},${
        options.range.height
      },${AutoTipUtils.replaceConstantPath(options.outPath)}`
    );
  },
};
