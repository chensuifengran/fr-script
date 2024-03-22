const { getInvokeApiMethods } = useInvokeApiMethodsRegister();
export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args: string[]) => {
    const params = await AutoTipUtils.paramsProcess(args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "disConnectTo"
    );
    const dialog = selfModule!.testModule!.dialog;
    dialog.args!.forEach((i, index) => {
      switch (index) {
        case 0:
          i.value = params[index] || "";
          break;
        default:
          break;
      }
    });
  },
  //参数处理生成方法
  parameterReplace: (options: {
    targetDevice: string;
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    options.replaceCurFnArgs(`"${options.targetDevice}"`);
  },
};
