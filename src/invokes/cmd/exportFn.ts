export const cmdFn = async (
  command: string,
  onlyExec: boolean = false,
  taskId?: string
) => {
  const { notAllowedFnId }  = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return"执行完成！";
  }
  try {
    if(onlyExec){
      execCommand.run(command);
      return"";
    }
    const res = await execCommand.run(command);
    return JSON.stringify(res);
  } catch (e) {
    console.error(e);
    return JSON.stringify(e);
  }
};
