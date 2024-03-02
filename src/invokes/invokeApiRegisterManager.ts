import { ListStore } from "../store/listStore";

const { registerInvokeApiMethods } = useInvokeApiMethodsRegister();
const getApiModules = async (listStore: ListStore) => {
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
      continue;
    }
    if (typeof module === "function") {
      const m = module(listStore);
      if (m) apis.push(m);
    } else {
      apis.push(module);
    }
  }
  return apis;
};
const registerAllInvokeApi = async (listStore: ListStore) => {
  const allModules = await getApiModules(listStore);

  if (!allModules) return;
  //注册所有api
  registerInvokeApiMethods([...allModules]);
};
export const invokeApiRegisterManager = () => {
  return { registerAllInvokeApi };
};
