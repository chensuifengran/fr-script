export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args) => {
    const params = await AutoTipUtils.paramsProcess(...args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "press" && i.scope === "Input"
    );
    const dialog = selfModule!.testModule!.dialog;
    dialog.args![0].value = params[0]?.value || "A";
  },
  //参数处理方法
  parameterReplace: (options: {
    key: Key;
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    options.replaceCurFnArgs(`'${options.key}'`);
  },
};
