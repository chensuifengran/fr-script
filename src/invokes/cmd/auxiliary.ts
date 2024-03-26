
export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args: string[]) => {
    const params = await AutoTipUtils.paramsProcess(args);
    const selfModule = getInvokeApiMethods().find((i) => i.name === "cmd");
    const dialog = selfModule!.testModule!.dialog;
    dialog.args!.forEach((i, index) => {
      switch(index){
        case 0:
          i.value = params[0] || "";
          break;
        case 1:
          i.value = params[1] || false;
          break;
      }
    });
  },
  //参数处理方法
  parameterReplace: (options: {
    command: string;
    onlyExec: boolean;
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    if(options.onlyExec){
      options.replaceCurFnArgs(`"${options.command}",true`);
    }else{
      options.replaceCurFnArgs(`"${options.command}"`);
    }
  },
};
