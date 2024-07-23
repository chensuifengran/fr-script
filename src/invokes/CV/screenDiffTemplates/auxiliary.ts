export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args: (string | string[])[]) => {
    const params = await AutoTipUtils.paramsProcess(args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "screenDiffTemplates" && i.scope === "CV"
    );
    const dialog = selfModule!.testModule!.dialog;
    dialog.args!.forEach((i, index) => {
      switch (index) {
        case 0:
          let _i = i as ArgItem<DialogArg.RectInput>;
          _i.value.x = +params[0] || 0;
          _i.value.y = +params[1] || 0;
          _i.value.width = +params[2] || 0;
          _i.value.height = +params[3] || 0;
          break;
        case 1:
          let __i = i as unknown as ArgItem<DialogArg.FileInput<true>>;
          __i.value = (params[4] as string[])?.map((i) =>
            AutoTipUtils.pathStrReset(i)
          );
          break;
        case 2:
          i.value = +params[5] || 0;
          break;
        case 3:
          i.value = !params[6] ? "auto" : (params[6] as string).toUpperCase();
          break;
        default:
          break;
      }
    });
  },
  //参数处理方法
  parameterReplace: (options: {
    range: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    tempPaths: string[];
    targetIndex: number;
    drive: string;
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    options.replaceCurFnArgs(
      `${options.range.x}, ${options.range.y}, ${options.range.width}, ${
        options.range.height
      }, [${options.tempPaths
        .map((i) => `"${AutoTipUtils.pathStrProcess(i)}"`)
        .join(",")}], ${options.targetIndex}${
        options.drive === "auto" ? "" : `, "${options.drive}"`
      }`
    );
  },
};
