export const disConnectToFn = async (targetDevice: string, taskId?: string) => {
  if (IS_PLAYGROUND_ENV) {
    return "disconnected xxx";
  }
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  let res = "出现异常";
  try {
    res = (await execCommand.adb(
      adbCommands.DISCONNECT_PREVAL + targetDevice
    ))!;
  } catch (e) {
    console.error(e);
    return JSON.stringify(e);
  }
  if (res.includes("disconnected")) {
    const store = useListStore();
    store.deviceList = store.deviceList.filter((item) => item !== targetDevice);
    const { currentDevice } = useScriptRuntime();
    currentDevice.value = "";
  }
  return res;
};
