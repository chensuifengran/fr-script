

export const auxiliary = <AuxiliaryType>{
  //快速编辑/修改参数弹窗打开时触发
  onDialogOpen: async (_close,...args) => {
    const params = await AutoTipUtils.paramsProcess(...args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "keyUp" && i.scope === "Input"
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
