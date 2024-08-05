export const auxiliary = <AuxiliaryType>{
  //快速编辑/修改参数弹窗打开时触发
  onDialogOpen: async (_close,...args) => {
    const params: BuildFormItems[] = args[0]?.value || [];
    _close();//关闭快速编辑/修改参数弹窗
    //TODO-打开交互表单编辑器
    console.log('buildForm onDialogOpen',params);
    
  },
  /**
   * 参数处理方法, 快速填写/修改参数弹窗点击确定时，会将弹窗中组件的值传入options，
   * 并且提供一个replaceCurFnArgs方法用来替换编辑器中当前函数的参数
   */
  parameterReplace: (options: {
    buildFormList: BuildFormItems[];
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    //根据实际情况去替换编辑器中的参数
    options.replaceCurFnArgs(
      JSON.stringify(options.buildFormList) /*替换后的参数字符串*/
    );
  },
};
