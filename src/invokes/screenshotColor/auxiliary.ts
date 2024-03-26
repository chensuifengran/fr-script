

export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args: string[]) => {
    const params = await AutoTipUtils.paramsProcess(args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "screenshotColor"
    );
    const dialog = selfModule!.testModule!.dialog;
    dialog.args!.forEach((i, index) => {
      if (index === 2) {
        i.value = params[index] || "normal";
      } else {
        i.value = +params[index] || 0;
      }
    });
  },
  //参数处理方法
  parameterReplace: (options: {
    x: number;
    y: number;
    mod: "normal" | "adb";
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    const { x, y, mod, replaceCurFnArgs } = options;
    if (mod === "adb") {
      replaceCurFnArgs(`${x},${y},'adb'`);
    } else {
      replaceCurFnArgs(`${x},${y}`);
    }
  },
};
