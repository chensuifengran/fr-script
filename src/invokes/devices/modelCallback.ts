import { devicesFn } from "./exportFn";

export const modelCallback = async (
  _options: undefined,
  testModuleCtx: {
    showDetails: (text: string | undefined, preStr?: string) => void;
  }
) => {
  const res = await devicesFn();
  if(res){
    testModuleCtx.showDetails(JSON.stringify(res));
  }else{
    testModuleCtx.showDetails("获取设备列表失败");
  }

};
