//引入函数类型
import { AppGSStore } from "../store/globalSettings";
import { devicesFnType } from "./devices/exportFn";
import { MoveToFnType } from "./moveTo/exportFn";
const { registerInvokeApiMethods } = useInvokeApiMethodsRegister();
const getApiModules = async (appStore: AppGSStore) => {
  const apiModules = import.meta.glob("./**/index.ts", {
    eager: true,
  });
  const _apis = Object.entries(apiModules);
  const apis: any[] = [];
  for (let i = 0; i < _apis.length; i++) {
    const [key, value] = _apis[i];
    const apiNamePath = await pathUtils.join(key, "../");
    const apiName = await pathUtils.basename(apiNamePath);
    const module = (value as any)[apiName + "Api"] || (value as any)[apiName];
    if (!module) {
      console.error(`找不到${apiName}Api或${apiName}模块`);
    }
    if (typeof module === "function") {
      const m = module(appStore);
      if(m) apis.push(m);
      return
    }
    if (module) apis.push(module);
  }
  return apis;
};
const registerAllInvokeApi = async (appStore: AppGSStore) => {
  const allModules = (await getApiModules(appStore));
  if (!allModules) return;
  //注册所有api
  registerInvokeApiMethods([...allModules]);
};
//由于exportAllFn无法动态推断类型，需要给导出的所有函数定义类型
export interface AllInvokeApiFn {
  moveTo: MoveToFnType;
  devices: devicesFnType;
}

export const invokeApiRegisterManager = () => {
  return { registerAllInvokeApi };
};
