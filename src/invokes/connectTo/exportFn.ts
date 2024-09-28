export const connectToFn = async (targetDevice: string, taskId?: string) => {
  if(IS_PLAYGROUND_ENV){
    return "already connected to XXX"
  }
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  if ((targetDevice?.trim() ?? "") === "") {
    console.warn("connectToFn: targetDevice为空");
    return;
  }
  let res = "出现异常";
  try {
    res = (await execCommand.adb(adbCommands.CONNECT_PREVAL + targetDevice))!;
  } catch (e) {
    console.error(e);
    return JSON.stringify(e);
  }
  if (res.includes("connected to") || res.includes("already connected to")) {
    const store = useListStore();
    if (!store.deviceList.includes(targetDevice)) {
      store.deviceList.push(targetDevice);
    }
    const { currentDevice } = useScriptRuntime();
    currentDevice.value = targetDevice;
  }
  return res;
};
