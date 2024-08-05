export const auxiliary = <AuxiliaryType>{
  //快速编辑/修改参数弹窗打开时触发
  onDialogOpen: async (_close,...args) => {
    const params = await AutoTipUtils.paramsProcess(...args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "waitKeys" && i.scope === "GlobalShortcut"
    );
    const dialog = selfModule!.testModule!.dialog;
    if (dialog.args && dialog.args[0]) {
      dialog.args[0].value = params.map((p) => {
        //替换掉p的[和]
        p.value = p.value.replace(/[\[\]]/g, "");
        return p.value;
      }) as string[];
    }
  },
  //参数处理方法
  parameterReplace: (options: {
    keys: string[];
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    options.replaceCurFnArgs(
      `[${options.keys.map((key) => `"${key}"`).join(", ")}]`
    );
  },
};
