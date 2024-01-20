import { invoke } from "@tauri-apps/api";
import { storeToRefs } from "pinia";

const getAppInfo = async () => {
  const res: string = await invoke("request_get", {
    url: "https://isyc.gitee.io/version-info.json",
  });
  const data = JSON.parse(res);
  if (data?.message) {
    return JSON.parse(data.message) as AppVersionConfig;
  }
};

const getDepInfo = async () => {
  const res: string = await invoke("request_get", {
    url: "https://isyc.gitee.io/dep.json",
  });
  const data = JSON.parse(res);
  if (data?.message) {
    return JSON.parse(data.message);
  }
  return {};
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
