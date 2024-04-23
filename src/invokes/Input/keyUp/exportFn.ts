export const keyUpFn = async (key:Key, taskId?: string) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return false;
  }
  try {
    const result = await invokeBaseApi.keyUp(key);
    return result;
  } catch (error) {
    console.error("keyUpFnError:", error);
    return false;
  }
};
