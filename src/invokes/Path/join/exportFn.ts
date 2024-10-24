export const joinFn = async (
  path: string,
  addPath: string,
  taskId?: string
) => {
  if (IS_PLAYGROUND_ENV) {
    return "";
  }
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return "";
  }
  try {
    const res = await pathUtils.join(path, addPath);
    return res;
  } catch (e) {
    console.error("joinFnError: ", e);
    return "";
  }
};
