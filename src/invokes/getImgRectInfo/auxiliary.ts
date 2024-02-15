const { getInvokeApiMethods } = useInvokeApiMethodsRegister();

export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args: string[]) => {
    const params = await AutoTipUtils.paramsProcess(args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "getImgRectInfo"
    );
    selfModule!.testModule!.dialog.args![0].value = AutoTipUtils.pathStrReset(
      params[0] || ""
    );
  },
  //参数处理方法
  parameterReplace: (options: {
    imgPath: string;
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    options.replaceCurFnArgs(`"${AutoTipUtils.pathStrProcess(options.imgPath)}"`);
  },
};
