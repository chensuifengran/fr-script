export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args) => {
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
