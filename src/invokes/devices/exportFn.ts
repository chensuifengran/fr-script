export const devicesFn = async (taskId?: string) => {
  const { notAllowedFnId }  = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    const res = await execCommand.adb(adbCommands.SHOW_DEVICES);
    return res;
  } catch (e) {
    console.error(e);
    return "";
  }
};
export type devicesFnType = typeof devicesFn;
