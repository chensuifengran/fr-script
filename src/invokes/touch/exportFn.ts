export const touchFn = async (
  targetX: number,
  targetY: number,
  taskId?: string
) => {
  if (IS_PLAYGROUND_ENV) {
    return "touch ok";
  }
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return "";
  }
  try {
    await execCommand.adb(adbCommands.CLICK_PREVAL + targetX + " " + targetY);
    return "touch ok";
  } catch (e) {
    console.error(e);
    return JSON.stringify(e);
  }
};
