export const basenameFn = async (
  path: string,
  ext?: string,
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
    const res = await pathUtils.basename(path, ext ? ext : undefined);
    return res;
  } catch (e) {
    console.error("basenameFnError: ", e);
    return "";
  }
};
