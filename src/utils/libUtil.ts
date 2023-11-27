import { invoke } from "@tauri-apps/api";
import { exists, renameFile } from "@tauri-apps/api/fs";
import { storeToRefs } from "pinia";

const renameLib = async (name: string, targetName: string) => {
  try {
    const installPath = await pathUtils.getInstallDir();
    const libPath = await pathUtils.join(installPath, name);
    const targetPath = await pathUtils.join(installPath, targetName);
    await renameFile(libPath, targetPath);
    console.log("renameFile", libPath, targetPath);
    
  } catch (error) {
    console.error("库文件重命名失败：", error);
  }
};

const syncDependentVersion = async () => {
  const appGSStore = useAppGlobalSettings();
  const { app } = storeToRefs(appGSStore);
  const d_version: string = await invoke("get_dependence_version");
  console.log("d_version", d_version);
  app.value.dependentSerial = d_version;
};

const syncOcrValue = async () => {
  const info = await libExists("paddle_inference.dll");
  if (info) {
    const size = info.fileSize;
    return size / 1024000 < 100 ? "CPU" : "GPU";
  }
};

const libExists = async (name: string) => {
  const installPath = await pathUtils.getInstallDir();
  const libPath = await pathUtils.join(installPath, name);
  if (await exists(libPath)) {
    return fsUtils.getFileInfo(libPath);
  }
};

export const libUtil = {
  libExists,
  renameLib,
  syncOcrValue,
  syncDependentVersion,
};
