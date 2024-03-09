export const touchFn = async (
  targetX: number,
  targetY: number,
  taskId?: string
) => {
  const { notAllowedFnId }  = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return"";
  }
  try {
    await execCommand.adb(adbCommands.CLICK_PREVAL + targetX + " " + targetY);
    return "touch ok";
  } catch (e) {
    console.error(e);
    return JSON.stringify(e);
  }
};
