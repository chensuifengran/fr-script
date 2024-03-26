

export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args: string[]) => {
    const params = await AutoTipUtils.paramsProcess(args);
    const selfModule = getInvokeApiMethods().find((i) => i.name === "ocr");
    const dialog = selfModule!.testModule!.dialog;
    dialog.args!.forEach((i, index) => {
      switch (index) {
        case 0:
          i.value = {
            x: +params[0] || 0,
            y: +params[1] || 0,
            width: +params[2] || 0,
            height: +params[3] || 0,
          };
          break;
        case 1:
          i.value = AutoTipUtils.pathStrReset(params[4] || "");
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
        `${options.rect.x}, ${options.rect.y}, ${options.rect.width}, ${
          options.rect.height
        }, ${p}`
      );
    }
  },
};
