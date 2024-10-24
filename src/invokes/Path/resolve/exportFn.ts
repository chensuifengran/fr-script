export const resolveFn = async (
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
    const res = await pathUtils.resolve(path, addPath);
    return res;
  } catch (e) {
    console.error("resolveFnError: ", e);
    return "";
  }
};
