
export const auxiliary = <AuxiliaryType>{
  //参数回填方法，快速填写参数弹窗打开时调用，用于弹窗内参数值的回填
  parameterBackfill: async (...args) => {
    let params = await AutoTipUtils.paramsProcess(...args);
    //当前函数的信息
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "randomMove" && i.scope === "Mouse"
    );
    const dialog = selfModule!.testModule!.dialog;
    dialog.args!.forEach((i, index) => {
      switch (index) {
        case 0:
        case 1:
          i.value = +params[index]?.value || 0;
          break;
        case 2:
        case 3:
          const dv = [0, 0] as const;
          i.value = params[index]?.value || dv;
          break;
        default:
          break;
      }
    });
  },
  //参数处理方法,快速填写参数弹窗点击确定后调用，replaceCurFnArgs方法用于替换编辑器中当前函数的参数
  parameterReplace: (options: {
    x: number;
    y: number;
    xRandomRange: [number, number];
    yRandomRange: [number, number];
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    if (
      options.xRandomRange[0] === 0 &&
      options.xRandomRange[1] === 0 &&
      options.yRandomRange[0] === 0 &&
      options.yRandomRange[1] === 0
    ) {
      options.replaceCurFnArgs(`${options.x}, ${options.y}`);
    } else
      options.replaceCurFnArgs(
        `${options.x}, ${options.y}, [[${options.xRandomRange[0]}, ${options.xRandomRange[1]}], [${options.yRandomRange[0]}, ${options.yRandomRange[1]}]]`
      );
  },
};
