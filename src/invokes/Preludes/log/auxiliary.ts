export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args: string[]) => {
    const params = await AutoTipUtils.paramsProcess(args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "log" && i.scope === "Preludes"
    );
    const dialog = selfModule!.testModule!.dialog;
    if (dialog.args) {
      dialog.args.forEach((arg, index) => {
        if (index === 0) {
          arg.value = params[0] || "";
        } else {
          arg.value = params[index] || "info";
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
