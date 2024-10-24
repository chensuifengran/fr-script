export const renameFn = async (
  oldPath: string,
  newPath: string,
  taskId?: string
) => {
  if (IS_PLAYGROUND_ENV) {
    return false;
  }
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return false;
  }
  try {
    const res = await fsUtils.rename(oldPath, newPath);
    return res;
  } catch (e) {
    console.error("renameFnError: ", e);
    return false;
  }
};
