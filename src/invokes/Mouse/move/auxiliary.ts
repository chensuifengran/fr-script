const { getInvokeApiMethods } = useInvokeApiMethodsRegister();
export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args: string[]) => {
    const params = await AutoTipUtils.paramsProcess(args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "move" && i.scope === "Mouse"
    );
    selfModule!.testModule!.dialog.args!.forEach((i, index) => {
      if (index === 2) {
        i.value = params[index] === "true" ? true : false || false;
      } else {
        i.value = +params[index] || 0;
      }
    });
  },
  //参数处理方法
  parameterReplace: (options: {
    x: number;
    y: number;
    isRelative: boolean;
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    if (options.isRelative) {
      options.replaceCurFnArgs(`${options.x}, ${options.y}, true`);
      return
    }
    options.replaceCurFnArgs(`${options.x}, ${options.y}`);
  },
};
