let lastExpression = "";
export const auxiliary = <AuxiliaryType>{
  //快速编辑/修改参数弹窗打开时触发
  onDialogOpen: async (_close, ...args) => {
    const params = await AutoTipUtils.paramsProcess(...args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "log" && i.scope === "Preludes"
    );
    const dialog = selfModule!.testModule!.dialog;
    if (dialog.args) {
      lastExpression = params[0]?.expression || "";
      dialog.args.forEach((arg, index) => {
        if (index === 0) {
          if (params[0]?.value) {
            if (typeof params[0].value === "string") {
              arg.value = params[0].value;
              arg.value = arg.value
                .replace(/(^["'`]{1,2})|(["'`]{1,2}$)/g, "")
                .replace(/\\/g, "");
            } else {
              arg.value = JSON.stringify(params[0].value).replace(/\\"/g, "");
            }
          }
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
    let lastExpressionJson = "";
    try {
      lastExpressionJson = JSON.stringify(
        new Function("", `const exp = ${lastExpression};return exp`)()
      );
    } catch (e) {}
    if (options.type !== "info") {
      if (options.msg === lastExpressionJson) {
        options.replaceCurFnArgs(`${lastExpression}, "${options.type}"`);
      } else {
        try {
          const testExp = new Function(
            "",
            `const exp = ${options.msg.replace(/\\/g, "")};return exp`
          )();
          if (typeof testExp === "object") {
            options.replaceCurFnArgs(
              `${options.msg.replace(/\\/g, "")}, "${options.type}"`
            );
            return;
          }
        } catch (error) {}
        options.replaceCurFnArgs(
          `\`${options.msg.replace(/\\/g, "")}\`, "${options.type}"`
        );
      }
    } else {
      if (options.msg === lastExpressionJson) {
        options.replaceCurFnArgs(`${lastExpression}`);
      } else {
        try {
          const testExp = new Function(
            "",
            `const exp = ${options.msg.replace(/\\/g, "")};return exp`
          )();
          if (typeof testExp === "object") {
            options.replaceCurFnArgs(`${options.msg.replace(/\\/g, "")}`);
            return;
          }
        } catch (error) {}
        options.replaceCurFnArgs(`\`${options.msg.replace(/\\/g, "")}\``);
      }
    }
  },
};
