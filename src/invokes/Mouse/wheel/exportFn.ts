export const wheelFn = async (delta: number, taskId?: string) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return false;
  }
  try {
    const res = await invokeBaseApi.wheel(delta);
    return res;
  } catch (error) {
    console.error("wheelFnError:", error);
    return false;
  }
};
