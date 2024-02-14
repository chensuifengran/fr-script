export const connectToFn = async (targetDevice: string, taskId?: string) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
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
  }
  return res;
};
export type ConnectToFnType = typeof connectToFn;
