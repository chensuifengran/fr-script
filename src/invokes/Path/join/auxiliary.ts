export const auxiliary = <AuxiliaryType>{
  //快速编辑/修改参数弹窗打开时触发
  onDialogOpen: async (_close, ...args) => {
    //处理来自编辑器的参数
    const params = await AutoTipUtils.paramsProcess(...args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "join" && i.scope === "Path"
    );
    const dialog = selfModule!.testModule!.dialog;
    if (!dialog.args) {
      return;
    }
    dialog.args.forEach((i, index) => {
      i.value = AutoTipUtils.pathStrReset(params[index]?.value || "");
    });
  },
  /**
   * 参数处理方法, 快速填写/修改参数弹窗点击确定时，会将弹窗中组件的值传入options，
   * 并且提供一个replaceCurFnArgs方法用来替换编辑器中当前函数的参数
   */
  parameterReplace: (options: {
    path: string;
    addPath: string;
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    options.replaceCurFnArgs(
      `${AutoTipUtils.replaceConstantPath(
        options.path
      )}, ${AutoTipUtils.replaceConstantPath(options.addPath)}`
    );
  },
};
