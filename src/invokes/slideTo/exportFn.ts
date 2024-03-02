
export const slideToFn = async (
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  slideTime: number,
  taskId?: string
) => {
  const { notAllowedFnId }  = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return"";
  }
  try {
    await execCommand.adb(
      `${adbCommands.SLIDE_PREVAL}${fromX} ${fromY} ${toX} ${toY} ${slideTime}`
    );
    return "滑动完成。";
  } catch (e) {
    console.error(e);
    return JSON.stringify(e);
  }
};
