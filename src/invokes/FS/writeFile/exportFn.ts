export const writeFileFn = async (
  path: string,
  content: string,
  taskId?: string
) => {
  if(IS_PLAYGROUND_ENV){
    console.error("writeFileFnError: ", "writeFileFn is not allowed in playground");
    return false
  }
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return false;
  }
  try {
    const res = await fsUtils.writeFile(path, content);
    return res === "文件写入成功";
  } catch (e) {
    console.error("writeFileFnError: ", e);
    return false;
  }
};