import { ColorUtil } from "../screenColor/ColorUtil";
import { adbScreenshotFn } from "../adbScreenshot/exportFn";

export const screenshotColorFn = async (
  x: number = 0,
  y: number = 0,
  mod: "normal" | "adb" = "normal",
  taskId?: string
): Promise<ColorUtil | undefined> => {
  const { notAllowedFnId } = useScriptRuntime();
  const appGSStore = useAppGlobalSettings();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  const path = appGSStore.envSetting.screenshotSavePath;
  if ((path.trim() ?? "") === "") {
    ElMessage.error("请先设置截图保存路径");
    return;
  }
  try {
    if (mod === "adb") {
      await adbScreenshotFn();
    }
    const json = await invokeBaseApi.imgColor(path, x, y);
    if (json.message === "success") {
      return new ColorUtil(json.data as [number, number, number], async () => {
        return screenshotColorFn(x, y, mod, taskId);
      });
    }
    return;
  } catch (e) {
    console.error("screenshotColorError: ", e);
  }
};
