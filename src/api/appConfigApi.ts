import { invoke } from "@tauri-apps/api/core"
import { storeToRefs } from "pinia";

const getAppInfo = async () => {
  const res: string = await invoke("request_get", {
    // url: "https://isyc.gitee.io/version-info.json",
    url:"http://47.106.34.210:8028/static/isYC/fr-script-info/version-info.json"
  });
  const data = JSON.parse(res);
  if (data?.message) {
    try {
      const res = JSON.parse(data.message);
      return res as AppVersionConfig;
    } catch (error) {
      console.warn('获取远程版本信息失败！',error);
    }
  }
};

const getDepInfo = async () => {
  const res: string = await invoke("request_get", {
    // url: "https://isyc.gitee.io/dep.json",
    url:"http://47.106.34.210:8028/static/isYC/fr-script-info/dep.json"
  });
  const data = JSON.parse(res);
  if (data?.message) {
    try{
      const res = JSON.parse(data.message);
      return res;
    }catch(e){
      console.warn('获取远程依赖信息失败！',e);
      return [];
    }
  }
  return [];
};

const syncLocalVersion = async () => {
  const info = await getAppInfo();
  if (info) {
    const version = info.app_version;
    const appGSStore = useAppGlobalSettings();
    const { app } = storeToRefs(appGSStore);
    app.value.latestVersion = version;
    return info;
  }else{
    console.warn("获取版本信息失败");
  }
};

export const appConfigApi = {
  syncLocalVersion,
  getDepInfo,
  getAppInfo
};
