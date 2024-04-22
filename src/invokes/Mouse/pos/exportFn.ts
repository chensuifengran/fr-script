export const posFn = async (taskId?: string) => {
  
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return {
      x: -1,
      y: -1
    };
  }
  try {
    const res = await invokeBaseApi.getMousePos();
    return res;
  } catch (e) {
    console.error(e);
    return {
      x: -1,
      y: -1
    };
  }
};
