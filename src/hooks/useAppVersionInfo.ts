import { invoke } from "@tauri-apps/api/tauri";
import DotLoader from "../components/loaderIcon/DotLoader.vue";

const appVersionInfo = ref<{
  version: string;
  desc: string;
  downloadUrl: DownloadUrl[];
  history: HistoryVersion[];
  forceUpdate: boolean;
  updateTime: string;
  openDialog: boolean;
}>({
  version: "",
  desc: "",
  downloadUrl: [],
  history: [],
  forceUpdate: false,
  updateTime: "",
  openDialog: false,
});
const goAppUpdate = async (haveUpdate: boolean) => {
  ElMessage({
    icon:DotLoader,
    dangerouslyUseHTMLString: true,
    message: "正在获取更新信息，请稍等",
    duration: 0,
    grouping: true,
  });
  try {
    const info = await appConfigApi.syncLocalVersion();
    if (info) {
      if (haveUpdate) {
        appVersionInfo.value.version = info.app_version;
        appVersionInfo.value.desc = info.desc;
        appVersionInfo.value.downloadUrl = info.download_url;
        appVersionInfo.value.history = info.history;
        appVersionInfo.value.forceUpdate = info.force_update;
        appVersionInfo.value.updateTime = info.update_time;
        appVersionInfo.value.openDialog = true;
      } else {
        ElNotification({
          title: "提示",
          message: "当前已是最新版本",
          type: "success",
          position: "bottom-right",
        });
      }
    }
  } catch (error) {
    ElNotification({
      title: "提示",
      message: "获取更新信息失败,请检查网络连接。",
      type: "error",
      position: "bottom-right",
    });
  }finally{
    ElMessage.closeAll();
  }
};
const goDownloadNewApp = async (item: DownloadUrl) => {
  if (item.pwd.length > 0) {
    execCopy(item.pwd);
    ElNotification({
      title: "提示",
      message: "提取码已复制到剪切板",
      type: "success",
      position: "bottom-right",
    });
  }
  await invoke("open_in_default_browser", {
    url: item.url,
  });
};
export const useAppVersionInfo = () => {
  return {
    appVersionInfo,
    goAppUpdate,
    goDownloadNewApp,
  };
};
