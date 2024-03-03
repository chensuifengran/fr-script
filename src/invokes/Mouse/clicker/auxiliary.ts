const { getInvokeApiMethods } = useInvokeApiMethodsRegister();

export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args: string[]) => {
    const params = await AutoTipUtils.paramsProcess(args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "clicker" && i.scope === "Mouse"
    );
    selfModule!.testModule!.dialog.args!.forEach((i, index) => {
      i.value = +params[index] || 0;
    });
  },
  //参数处理方法
  parameterReplace: (options: {
    duration: number;
    sleep: number;
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    options.replaceCurFnArgs(`${options.duration}, ${options.sleep}`);
  },
};