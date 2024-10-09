import { UnlistenFn } from "@tauri-apps/api/event";
import { type WebviewWindowUtil } from "../utils/windowUtil";
const allLibsName = ref<string[]>([]);
const lackDependence = reactive<NeedUpdateDepType[][]>([]);
const activeDrewerName = ref("lackDepDownload");
const contentLoading = ref(false);
const needUpdateDepList = ref<NeedUpdateDepType[]>([]);
const depPkgList = ref<DepPkgItemType[]>([]);
const { notify } = eventUtil;
let depManagerWindow: WebviewWindowUtil | null = null;
let unlistenFn: UnlistenFn = () => {};
const { open } = windowUtil;
const goInstallDeps = async (target?: string) => {
  if (IS_PLAYGROUND_ENV) {
    ElNotification({
      title: "提示",
      message: "playground环境不支持依赖管理",
      type: "warning",
      position: "bottom-right",
    });
    return;
  }
  notify
    .listen((e) => {
      const { type } = e.payload;
      if (type === "message") {
        const { payload: data } = e.payload;
        if (data?.name === "sentDataToMain") {
          syncMainData();
        } else if (data?.name === "closeDepManager") {
          closeDepManagerWindow();
        }
      }
    })
    .then((fn) => (unlistenFn = fn));
  contentLoading.value = true;
  depManagerWindow = await open("depManager", "/depManager", {
    dragDropEnabled: true,
  });
  if (target && (typeof target === "string" || typeof target === "number")) {
    activeDrewerName.value = target;
  } else {
    activeDrewerName.value = "lackDepDownload";
  }
  await libUtil.syncDependentVersion();
  contentLoading.value = false;
};

const syncMainData = () => {
  if (IS_PLAYGROUND_ENV) {
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
const closeDepManagerWindow = async () => {
  if (IS_PLAYGROUND_ENV) {
    return;
  }
  if (!depManagerWindow?.isClosed()) {
    depManagerWindow?.close();
    depManagerWindow = null;
  }
  unlistenFn && unlistenFn();
};
const close = () => {
  if (IS_PLAYGROUND_ENV) {
    return;
  }
  notify.send({
    name: "closeDepManager",
  });
};
const syncData = (data: any) => {
  if (IS_PLAYGROUND_ENV || !data) {
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
