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
    return false;
  }
  const appGSStore = useAppGlobalSettings();
  savePath = savePath.length
    ? savePath
    : appGSStore.envSetting.screenshotSavePath;
  try {
    const res = await invokeBaseApi.screenshot(savePath, x, y, width, height);
    return res;
  } catch (e) {
    console.error("screenshotError: ", e);
    return false;
  }
};
