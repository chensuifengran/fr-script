export const buildFormFn = async (
  buildFormList: BuildFormItems[] = [],
  taskId?: string
) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return false;
  }
  try {
    //TODO
  } catch (e) {
    console.error("buildFormFnError: ", e);
  }
};