export const textFn = async (text: string, taskId?: string) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return false;
  }
  try {
    const result = await invokeBaseApi.inputText(text);
    return result;
  } catch (error) {
    console.error("textFnError:", error);
    return false
  }
};
