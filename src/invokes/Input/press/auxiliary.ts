const { getInvokeApiMethods } = useInvokeApiMethodsRegister();

export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args: string[]) => {
    const params = await AutoTipUtils.paramsProcess(args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "press" && i.scope === "Input"
    );
    selfModule!.testModule!.dialog.args!.forEach((i, index) => {
      i.value = params[index] || "A";
    });
  },
  //参数处理方法
  parameterReplace: (options: {
    key:Key,
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    options.replaceCurFnArgs(
      `'${options.key}'`
    );
  },
};
