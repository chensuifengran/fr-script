export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args: string[]) => {
    const params = await AutoTipUtils.paramsProcess(args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "waitKeys" && i.scope === "GlobalShortcut"
    );
    const dialog = selfModule!.testModule!.dialog;
    if (dialog.args && dialog.args[0]) {
      dialog.args[0].value = params.map((p) => {
        //替换掉p的[和]
        p = p.replace(/[\[\]]/g, "");
        return p;
      });
    };
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
