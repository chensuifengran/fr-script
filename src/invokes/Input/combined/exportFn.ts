export const combinedFn = async (keys: Key[], taskId?: string) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return false;
  }
  try {
    const res = await invokeBaseApi.combined(keys);
    return res;
  } catch (error) {
    console.error("combinedFnError:", error);
    return false;
  }
};
