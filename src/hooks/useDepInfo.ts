import { DepPkgItemType, NeedUpdateDepType } from "../types/lib";
const allLibsName = ref<string[]>([]);
const showDepDrewer = ref(false);
const lackDependence = reactive<NeedUpdateDepType[][]>([]);
const activeDrewerName = ref("lackDepDownload");
const contentLoading = ref(false);
const goInstallDeps = async (target?: string) => {
  contentLoading.value = true;
  showDepDrewer.value = true;
  if (target) {
    activeDrewerName.value = target;
  }
  await libUtil.syncDependentVersion();
  const lackDeps = await libUtil.checkDepLack();
  if (lackDeps.length > 0) {
    lackDependence.splice(0, lackDependence.length, ...lackDeps);
  }
  contentLoading.value = false;
};
const needUpdateDepList = ref<NeedUpdateDepType[]>([]);
const depPkgList = ref<DepPkgItemType[]>([]);
export const useDepInfo = () => {
  return {
    showDepDrewer,
    goInstallDeps,
    lackDependence,
    activeDrewerName,
    allLibsName,
    needUpdateDepList,
    contentLoading,
    depPkgList
  };
};
