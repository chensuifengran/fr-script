export const devicesFn = async (taskId?: string) => {
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
    return deviceList;
  } catch (e) {
    console.error("devicesFn error:", e);
    return;
  }
};
