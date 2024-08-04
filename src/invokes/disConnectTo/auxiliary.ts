export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args) => {
    const params = await AutoTipUtils.paramsProcess(...args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "disConnectTo"
    );
    const dialog = selfModule!.testModule!.dialog;
    const i = dialog.args![0];
    if (i.componentType === "select") {
      i.value = params[0]?.value || "";
    }
  },
  //参数处理生成方法
  parameterReplace: (options: {
    targetDevice: string;
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    options.replaceCurFnArgs(`"${options.targetDevice}"`);
  },
};
