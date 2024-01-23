const { getInvokeApiMethods } = useInvokeApiMethodsRegister();
export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args: string[]) => {
    let params = await AutoTipUtils.paramsProcess(args);
    const selfModule = getInvokeApiMethods().find((i) => i.name === "moveTo");
    let rangeStr = '';
    if(params.length > 2){
      for(let i = 2; i < params.length; i++){
        rangeStr += ','+params[i];
      }
    }
    rangeStr = rangeStr.slice(1);
    selfModule!.testModule!.dialog.args!.forEach((i, index) => {
      switch (index) {
        case 0:
          i.value = +(params[0] || "");
          break;
        case 1:
          i.value = +(params[1] || "");
          break;
        case 2:
          let value = [0,0];
          if(rangeStr.length){
            value = JSON.parse(rangeStr)[0];
          }
          i.value = value;
          break;
        case 3:
          let value1 = [0,0];
          if(rangeStr.length){
            value1 = JSON.parse(rangeStr)[1] || [0,0];
          }
          i.value = value1;
          break;
        default:
          break;
      }
    });
  },
  //参数处理方法
  parameterReplace: (options: {
    x: number;
    y: number;
    randomRange: [[number, number], [number, number]];
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    options.replaceCurFnArgs(
      `"${options.x}", "${options.y}", "${JSON.stringify(options.randomRange)}"`
    );
  },
};
