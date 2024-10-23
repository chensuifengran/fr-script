export const readFileFn = async (path: string, taskId?: string) => {
  if (IS_PLAYGROUND_ENV) {
    return "";
  }
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return "";
  }
  try {
    const res = await fsUtils.readFile(path);
    return res;
  } catch (e) {
    console.error("readFileFnError: ", e);
    return "";
  }
};
