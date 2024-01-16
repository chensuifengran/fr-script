import { NeedUpdateDepType } from "../types/lib";
const allLibsName = ref<string[]>([]);
const showDepDrewer = ref(false);
const lackDependence = reactive<NeedUpdateDepType[][]>([]);
const activeDrewerName = ref("lackDepDownload");
const goInstallDeps = async () => {
  showDepDrewer.value = true;
  const lackDeps = await libUtil.checkDepLack();
  if (lackDeps.length > 0) {
    lackDependence.splice(0, lackDependence.length, ...lackDeps);
  }
};

export const useDepInfo = () => {
  return {
    showDepDrewer,
    goInstallDeps,
    lackDependence,
    activeDrewerName,
    allLibsName
  };
};
