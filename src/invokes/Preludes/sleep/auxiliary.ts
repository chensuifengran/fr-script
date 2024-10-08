export const auxiliary = <AuxiliaryType>{
  //快速编辑/修改参数弹窗打开时触发
  onDialogOpen: async (_close,...args) => {
    const params = await AutoTipUtils.paramsProcess(...args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "sleep" && i.scope === "Preludes"
    );
    const dialog = selfModule!.testModule!.dialog;

    if (dialog.args) {
      if (!isNaN(Number(params[0]?.value))) {
        dialog.args[0].value = Number(params[0]?.value) || 1000;
      } else {
        dialog.args[0].value = 1000;
      }
    }
  },
  //参数处理方法
  parameterReplace: (options: {
    ms: number;
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    if (options.ms === 1000) {
      options.replaceCurFnArgs(``);
    } else {
      options.replaceCurFnArgs(`${options.ms}`);
    }
  },
};
