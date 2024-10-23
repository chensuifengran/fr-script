export const auxiliary = <AuxiliaryType>{
  //快速编辑/修改参数弹窗打开时触发
  onDialogOpen: async (_close, ...args) => {
    //处理来自编辑器的参数
    const params = await AutoTipUtils.paramsProcess(...args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "readDir" && i.scope === "FS"
    );
    const dialog = selfModule!.testModule!.dialog;
    if (!dialog.args) {
      return;
    }
    //根据参数的位置给弹窗对应的组件进行回填赋值
    dialog.args.forEach((i, index) => {
      switch (index) {
        case 0:
          //第一个参数为RectInput组件的值，刚好是函数前四个参数，故赋值如下
          i.value = AutoTipUtils.pathStrReset(params[index].value || "");
          break;
        default:
          break;
      }
    });
  },
  /**
   * 参数处理方法, 快速填写/修改参数弹窗点击确定时，会将弹窗中组件的值传入options，
   * 并且提供一个replaceCurFnArgs方法用来替换编辑器中当前函数的参数
   */
  parameterReplace: (options: {
    path: string;
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    options.replaceCurFnArgs(AutoTipUtils.replaceConstantPath(options.path));
  },
};
