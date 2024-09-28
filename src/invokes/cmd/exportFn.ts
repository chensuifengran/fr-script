export const cmdFn = async (
  command: string,
  onlyExec: boolean = false,
  taskId?: string
) => {
  if(IS_PLAYGROUND_ENV){
    return "The execution is complete"
  }
  const { notAllowedFnId }  = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return"The execution is complete";
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
