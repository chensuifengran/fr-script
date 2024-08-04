export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args) => {
    //处理来自编辑器的参数
    const params = await AutoTipUtils.paramsProcess(...args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "buildForm" && i.scope === "Preludes"
    );
    const dialog = selfModule!.testModule!.dialog;
    if (!dialog.args) {
      return;
    }
    //根据参数的位置给弹窗对应的组件进行回填赋值
    dialog.args.forEach((i, index) => {
      /**
       * 例如函数本身有5个参数，而弹窗只有两个参数，params为编辑器中输入的5个参数，
       * index为弹窗中的参数位置，i.value为弹窗中组件的值
       * @example:
      switch (index) {
        case 0:
          //第一个参数为RectInput组件的值，刚好是函数前四个参数，故赋值如下
          i.value = {
            x: +params[0]?.value || 0,
            y: +params[1]?.value || 0,
            width: +params[2]?.value || 0,
            height: +params[3]?.value || 0,
          };
          break;
        case 1:
          //第二个参数为FileInput组件的值，AutoTipUtils.pathStrReset用来处理路径字符串
          i.value = AutoTipUtils.pathStrReset(params[4] || "");
          break;
        default:
          break;
      }
      */
    });
  },
  /**
   * 参数处理方法, 快速填写/修改参数弹窗点击确定时，会将弹窗中组件的值传入options，
   * 并且提供一个replaceCurFnArgs方法用来替换编辑器中当前函数的参数
   */
  parameterReplace: (options: {
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    //根据实际情况去替换编辑器中的参数
    options.replaceCurFnArgs("" /*替换后的参数字符串*/);
  },
};
