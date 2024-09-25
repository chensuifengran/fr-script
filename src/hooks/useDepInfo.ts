import { WebviewWindow } from "@tauri-apps/api/window";
import { UnlistenFn } from "@tauri-apps/api/event";
const allLibsName = ref<string[]>([]);
const lackDependence = reactive<NeedUpdateDepType[][]>([]);
const activeDrewerName = ref("lackDepDownload");
const contentLoading = ref(false);
const needUpdateDepList = ref<NeedUpdateDepType[]>([]);
const depPkgList = ref<DepPkgItemType[]>([]);
const { notify } = eventUtil;
let depManagerWindow: WebviewWindow | null = null;
const goInstallDeps = async (target?: string) => {
  if(IS_PLAYGROUND_ENV){
    //playground环境
    ElNotification({
      title: "提示",
      message: "playground环境不支持依赖管理",
      type: "warning",
      position: "bottom-right",
    });
    return;
  }
  contentLoading.value = true;
  depManagerWindow = useWebviewWindow().createWindow(
    "depManager",
    "/depManager",
    {
      fileDropEnabled: true,
    }
  );
  if (target && (typeof target === "string" || typeof target === "number")) {
    activeDrewerName.value = target;
  } else {
    activeDrewerName.value = "lackDepDownload";
  }
  await libUtil.syncDependentVersion();
  contentLoading.value = false;
};

let unlistenFn: UnlistenFn;
if (!IS_PLAYGROUND_ENV) {
  //非playground环境
  notify
    .listen((e) => {
      if (e.windowLabel === "main") {
        const { type, payload: data } = e.payload;
        if (type === "message") {
          if (data?.name === "sentDataToMain") {
            syncMainData();
          }
        }
      } else {
        const { type, payload: data } = e.payload;
        if (type === "message") {
          if (data?.name === "closeDepManager") {
            closeDepManagerWindow();
          }
        }
      }
    })
    .then((fn) => (unlistenFn = fn));
} else {
  unlistenFn = () => {};
}

const syncMainData = () => {
  if (IS_PLAYGROUND_ENV) {
    //playground环境
    return;
  }
  notify.send({
    name: "syncMainData",
    payload: {
      allLibsName: allLibsName.value,
      lackDependence: lackDependence,
      activeDrewerName: activeDrewerName.value,
      needUpdateDepList: needUpdateDepList.value,
      depPkgList: depPkgList.value,
      contentLoading: contentLoading.value,
    },
  });
};
const closeDepManagerWindow = () => {
  if (IS_PLAYGROUND_ENV) {
    //playground环境
    return;
  }
  if (!depManagerWindow) {
    const w = WebviewWindow.getByLabel("depManager");
    w && w.close();
  } else {
    depManagerWindow?.close();
    depManagerWindow = null;
  }
  unlistenFn && unlistenFn();
};
const close = () => {
  if (IS_PLAYGROUND_ENV) {
    //playground环境
    return;
  }
  notify.send({
    name: "closeDepManager",
  });
};
const syncData = (data: any) => {
  if(IS_PLAYGROUND_ENV || !data){
    return;
  }
  const {
    allLibsName: _allLibsName,
    lackDependence: _lackDependence,
    activeDrewerName: _activeDrewerName,
    needUpdateDepList: _needUpdateDepList,
    depPkgList: _depPkgList,
    contentLoading: _contentLoading,
  } = data;
  allLibsName.value = _allLibsName;
  lackDependence.splice(0, lackDependence.length, ..._lackDependence);
  activeDrewerName.value = _activeDrewerName;
  needUpdateDepList.value = _needUpdateDepList;
  depPkgList.value = _depPkgList;
  contentLoading.value = _contentLoading;
  libUtil.syncDependentVersion();
};
export const useDepInfo = () => {
  return {
    goInstallDeps,
    lackDependence,
    activeDrewerName,
    allLibsName,
    needUpdateDepList,
    contentLoading,
    depPkgList,
    close,
    syncData,
    syncMainData,
  };
};
