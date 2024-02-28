//引入函数类型
import { ListStore } from "../store/listStore";
import { AdbScreenshotFnType } from "./adbScreenshot/exportFn";
import { AdbStateFnType } from "./adbState/exportFn";

import { ClickHomeKeyFnType } from "./clickHomeKey/exportFn";
import { ConnectToFnType } from "./connectTo/exportFn";
import { cropPictureType } from "./cropPicture/exportFn";
import { DevicesFnType } from "./devices/exportFn";
import { DisConnectToFnType } from "./disConnectTo/exportFn";
import { MoveToFnType } from "./moveTo/exportFn";
import { SlideToFnType } from "./slideTo/exportFn";
import { TouchFnType } from "./touch/exportFn";
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
    }else{
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
//由于exportAllFn无法动态推断类型，需要给导出的所有函数定义类型
export type AllInvokeApiFn = {
  moveTo: MoveToFnType;
  devices: DevicesFnType;
  clickHomeKey: ClickHomeKeyFnType;
  touch: TouchFnType;
  connectTo: ConnectToFnType;
  disConnectTo: DisConnectToFnType;
  adbScreenshot: () => AdbScreenshotFnType;
  slideTo: SlideToFnType;
  cropPicture: () => cropPictureType;
  adbState: () => AdbStateFnType;
};

export const invokeApiRegisterManager = () => {
  return { registerAllInvokeApi };
};
