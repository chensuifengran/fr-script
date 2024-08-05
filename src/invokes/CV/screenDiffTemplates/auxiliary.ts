export const auxiliary = <AuxiliaryType>{
  //快速编辑/修改参数弹窗打开时触发
  onDialogOpen: async (_close,...args) => {
    const params = await AutoTipUtils.paramsProcess(...args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "screenDiffTemplates" && i.scope === "CV"
    );
    const dialog = selfModule!.testModule!.dialog;
    dialog.args!.forEach((i, index) => {
      switch (index) {
        case 0:
          let _i = i as ArgItem<DialogArg.RectInput>;
          _i.value.x = +params[0]?.value || 0;
          _i.value.y = +params[1]?.value || 0;
          _i.value.width = +params[2]?.value || 0;
          _i.value.height = +params[3]?.value || 0;
          break;
        case 1:
          let __i = i as unknown as ArgItem<DialogArg.FileInput<true>>;
          __i.value = (params[4]?.value as string[])?.map((i) =>
            AutoTipUtils.pathStrReset(i)
          );
          break;
        case 2:
          i.value = +params[5]?.value || 0;
          break;
        case 3:
          i.value = !params[6]?.value
            ? "auto"
            : (params[6]?.value as string).toUpperCase();
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
