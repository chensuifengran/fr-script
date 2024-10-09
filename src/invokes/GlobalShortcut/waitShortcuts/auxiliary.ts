export const auxiliary = <AuxiliaryType>{
  //快速编辑/修改参数弹窗打开时触发
  onDialogOpen: async (_close, ...args) => {
    const params = await AutoTipUtils.paramsProcess(...args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "waitShortcuts" && i.scope === "GlobalShortcut"
    );
    const dialog = selfModule!.testModule!.dialog;
    if (dialog.args && dialog.args[0] && params.length) {
      if (params[0].type === "string[]") {
        dialog.args[0].value = params[0].value.map((p: string) => {
          //替换掉p的[和]
          return p.replace(/[\[\]]/g, "");
        }) as string[];
      } else {
        dialog.args[0].value = [params[0].value.replace(/[\[\]]/g, "")];
      }
    }
  },
  //参数处理方法
  parameterReplace: (options: {
    shortcuts: string | string[];
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    if (
      typeof options.shortcuts === "string" ||
      options.shortcuts.length === 1
    ) {
      const shortcut =
        typeof options.shortcuts === "string"
          ? options.shortcuts
          : options.shortcuts[0];
      options.replaceCurFnArgs(`"${shortcut}"`);
      return;
    }
    options.replaceCurFnArgs(
      `[${options.shortcuts.map((shortcut) => `"${shortcut}"`).join(", ")}]`
    );
  },
};
