export const auxiliary = <AuxiliaryType>{
  //快速编辑/修改参数弹窗打开时触发
  onDialogOpen: async (_close,...args) => {
    const params = await AutoTipUtils.paramsProcess(...args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "getImgRectInfo"
    );
    const dialog = selfModule!.testModule!.dialog;
    dialog.args![0].value = AutoTipUtils.pathStrReset(params[0]?.value || "");
  },
  //参数处理方法
  parameterReplace: (options: {
    imgPath: string;
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    options.replaceCurFnArgs(
      `${AutoTipUtils.replaceConstantPath(options.imgPath)}`
    );
  },
};
