export const keyDownFn = async (key:Key, taskId?: string) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return false;
  }
  try {
    const result = await invokeBaseApi.keyDown(key);
    return result;
  } catch (error) {
    console.error("keyDownFnError:", error);
    return false;
  }
};
