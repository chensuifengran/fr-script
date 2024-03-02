import { invoke } from "@tauri-apps/api";

export const screenshotFn = async (
  x = -1,
  y = -1,
  width = -1,
  height = -1,
  savePath = "",
  taskId?: string
) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  const appGSStore = useAppGlobalSettings();
  savePath = savePath.length
    ? savePath
    : appGSStore.envSetting.screenshotSavePath;
  try {
    const res = await invoke<string>("screenshot", {
      x,
      y,
      w: width,
      h: height,
      path: savePath,
    });
    const json = JSON.parse(res);
    if (json.code !== 200) {
      console.error("screenshotError: ", json);
      return false;
    }
    return true;
  } catch (e) {
    console.error("screenshotError: ", e);
  }
};
