export const readDirFn = async (path: string, taskId?: string) => {
  if (IS_PLAYGROUND_ENV) {
    return [];
  }
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return [];
  }
  try {
    const res = await fsUtils.readDir(path);
    return res;
  } catch (e) {
    console.error("readDirFnError: ", e);
    return [];
  }
};
