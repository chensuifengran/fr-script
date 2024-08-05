

export const auxiliary = <AuxiliaryType>{
  //快速编辑/修改参数弹窗打开时触发
  onDialogOpen: async (_close,...args) => {
    const params = await AutoTipUtils.paramsProcess(...args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "combined" && i.scope === "Input"
    );
    const dialog = selfModule!.testModule!.dialog;
    dialog.args!.forEach((i,index) => {
      if(index === 0){
        i.value = params.map((i) => i.value.replace("[", "").replace("]", ""));
      }
    });
  },
  //参数处理方法
  parameterReplace: (options: {
    keys: Key[];
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    options.replaceCurFnArgs(
      `[${options.keys.map((i) => `"${i}"`).join(",")}]`
    );
  },
};
