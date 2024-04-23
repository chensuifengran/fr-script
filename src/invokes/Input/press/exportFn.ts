export const pressFn = async (key: Key, taskId?: string) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return false;
  }
  try {
    const result = await invokeBaseApi.pressKey(key);
    return result;
  } catch (error) {
    console.error("pressFnError:", error);
    return false;
  }
};
