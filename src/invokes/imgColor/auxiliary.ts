const { getInvokeApiMethods } = useInvokeApiMethodsRegister();

export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args: string[]) => {
    const params = await AutoTipUtils.paramsProcess(args);
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "imgColor"
    );
    selfModule!.testModule!.dialog.args!.forEach((i, index) => {
      if(index === 0){
        i.value = params[index] || "";
      }else{
        i.value = +params[index] || 0;
      }
    });
  },
  //参数处理方法
  parameterReplace: (options: {
    path: string;
    x: number;
    y: number;
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    const { x, y, replaceCurFnArgs } = options;
    replaceCurFnArgs(`"${AutoTipUtils.pathStrProcess(options.path)}", ${x}, ${y}`);
  },
};
