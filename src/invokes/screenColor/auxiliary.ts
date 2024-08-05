

export const auxiliary = <AuxiliaryType>{
  //快速编辑/修改参数弹窗打开时触发
  onDialogOpen: async (_close,...args) => {
    const params = await AutoTipUtils.paramsProcess(...args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "screenColor"
    );
    const dialog = selfModule!.testModule!.dialog;
    dialog.args!.forEach((i, index) => {
      i.value = +params[index]?.value || 0;
    });
  },
  //参数处理方法
  parameterReplace: (options: {
    x?: number;
    y?: number;
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    const { x, y, replaceCurFnArgs } = options;
    if (x !== undefined && y !== undefined && x !== -1 && y !== -1) {
      replaceCurFnArgs(`${x},${y}`);
    } else {
      replaceCurFnArgs("");
    }
  },
};
