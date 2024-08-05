export const auxiliary = <AuxiliaryType>{
  //快速编辑/修改参数弹窗打开时触发
  onDialogOpen: async (_close,...args) => {
    const params = await AutoTipUtils.paramsProcess(...args);
    const selfModule = getInvokeApiMethods().find((i) => i.name === "ocr");
    const dialog = selfModule!.testModule!.dialog;
    if (!dialog.args) {
      return;
    }
    dialog.args.forEach((i, index) => {
      switch (index) {
        case 0:
          i.value = {
            x: +params[0]?.value || 0,
            y: +params[1]?.value || 0,
            width: +params[2]?.value || 0,
            height: +params[3]?.value || 0,
          };
          break;
        case 1:
          i.value = AutoTipUtils.pathStrReset(params[4]?.value || "");
          break;
        default:
          break;
      }
    });
  },
  //参数处理方法
  parameterReplace: (options: {
    rect: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    imgPath?: string;
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    if (!options.imgPath || options.imgPath === "") {
      options.replaceCurFnArgs(
        `${options.rect.x},${options.rect.y},${options.rect.width},${options.rect.height}`
      );
    } else {
      const p = AutoTipUtils.replaceConstantPath(options.imgPath);
      options.replaceCurFnArgs(
        `${options.rect.x}, ${options.rect.y}, ${options.rect.width}, ${options.rect.height}, ${p}`
      );
    }
  },
};
