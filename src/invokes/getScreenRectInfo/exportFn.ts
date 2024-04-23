export const getScreenRectInfoFn = async (delayTime = 0, taskId?: string) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return {
      startX: -2,
      startY: -2,
      width: -2,
      height: -2,
    };
  }
  try {
    await new Promise((resolve) => setTimeout(resolve, delayTime));
    const res = await invokeBaseApi.getScreenRectInfo();
    return res as {
      startX: number;
      startY: number;
      width: number;
      height: number;
    };
  } catch (e) {
    console.error(e);
    return {
      startX: -1,
      startY: -1,
      width: -1,
      height: -1,
    };
  }
};
