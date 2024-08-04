

export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args) => {
    const params = await AutoTipUtils.paramsProcess(...args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "text" && i.scope === "Input"
    );
    const dialog = selfModule!.testModule!.dialog;
    dialog.args!.forEach((i, index) => {
      if (index === 0) {
        i.value = params[index]?.value || "";
      }
    });
  },
  //参数处理方法
  parameterReplace: (options: {
    text: string;
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    options.replaceCurFnArgs(`'${options.text}'`);
  },
};
