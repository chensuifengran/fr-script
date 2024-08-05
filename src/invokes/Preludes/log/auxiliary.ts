export const auxiliary = <AuxiliaryType>{
  //快速编辑/修改参数弹窗打开时触发
  onDialogOpen: async (_close,...args) => {
    const params = await AutoTipUtils.paramsProcess(...args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "log" && i.scope === "Preludes"
    );
    const dialog = selfModule!.testModule!.dialog;
    if (dialog.args) {
      dialog.args.forEach((arg, index) => {
        if (index === 0) {
          arg.value = params[0]?.value ? JSON.stringify(params[0]?.value) : "";
          arg.value = arg.value.replace(/(^["'`]{1,2})|(["'`]{1,2}$)/g, "");
        } else {
          arg.value = params[index]?.value || "info";
        }
      });
    }
  },
  //参数处理方法
  parameterReplace: (options: {
    msg: string;
    type: "success" | "danger" | "info" | "warning" | "loading";
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    if (options.type !== "info") {
      options.replaceCurFnArgs(`"${options.msg}", "${options.type}"`);
    } else {
      options.replaceCurFnArgs(`"${options.msg}"`);
    }
  },
};
