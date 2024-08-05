export const auxiliary = <AuxiliaryType>{
  //快速编辑/修改参数弹窗打开时触发
  onDialogOpen: async (_close,...args) => {
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
