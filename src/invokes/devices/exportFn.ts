export const devicesFn = async (taskId?: string) => {
  if(IS_PLAYGROUND_ENV){
    return [];
  }
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    const res = await execCommand.adb(adbCommands.SHOW_DEVICES);
    const deviceList = res
      .replace("List of devices attached", "")
      .replace(/\s/g, "")
      .split("device")
      .filter((i) => i !== "");
    const listStore = useListStore();
    listStore.deviceList = deviceList;
    return deviceList;
  } catch (e) {
    console.error("devicesFn error:", e);
    return;
  }
};
