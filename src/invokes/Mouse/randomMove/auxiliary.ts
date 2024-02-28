const { getInvokeApiMethods } = useInvokeApiMethodsRegister();
export const auxiliary = <AuxiliaryType>{
  //参数回填方法，快速填写参数弹窗打开时调用，用于弹窗内参数值的回填
  parameterBackfill: async (...args: string[]) => {
    let params = await AutoTipUtils.paramsProcess(args);
    //当前函数的信息
    const selfModule = getInvokeApiMethods().find((i) => i.name === "randomMove" && i.scope === "Mouse");
    let rangeStr = "";
    if (params.length > 2) {
      for (let i = 2; i < params.length; i++) {
        rangeStr += "," + params[i];
      }
    }
    rangeStr = rangeStr.slice(1);
    selfModule!.testModule!.dialog.args!.forEach((i, index) => {
      switch (index) {
        case 0:
          i.value = +(params[0] || "");
          break;
        case 1:
          i.value = +(params[1] || "");
          break;
        case 2:
          let value = [0, 0];
          if (rangeStr.length) {
            value = JSON.parse(rangeStr)[0];
          }
          i.value = value;
          break;
        case 3:
          let value1 = [0, 0];
          if (rangeStr.length) {
            value1 = JSON.parse(rangeStr)[1] || [0, 0];
          }
          i.value = value1;
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
