const { getInvokeApiMethods } = useInvokeApiMethodsRegister();

export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args: string[]) => {
    const params = await AutoTipUtils.paramsProcess(args);
    const selfModule = getInvokeApiMethods().find((i) => i.name === "slideTo");
    const dialog = selfModule!.testModule!.dialog;
    dialog.args!.forEach((i, index) => {
      i.value = +params[index] || 0;
    });
  },
  //参数处理生成方法
  parameterReplace: (options: {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    slideTime: number;
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    options.replaceCurFnArgs(
      `${options.fromX},${options.fromY},${options.toX},${options.toY},${options.slideTime}`
    );
  },
};
