export const getScreenSizeFn = async (taskId?: string) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return {
      width: -1,
      height: -1,
    };
  }
  try {
    const res = await invokeBaseApi.getScreenSize();
    return res;
  } catch (e) {
    console.error(e);
    return {
      width: -1,
      height: -1,
    };
  }
};
