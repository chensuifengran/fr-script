export const getImageSizeFn = async (path: string, taskId?: string) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return {
      width: -2,
      height: -2,
    };
  }
  try {
    const res = await invokeBaseApi.getImgSize(path);
    return res;
  } catch (e) {
    console.error(e);
    return {
      width: -1,
      height: -1,
    };
  }
};
