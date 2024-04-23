export const screenDiffTemplatesFn = async (
  x: number,
  y: number,
  width: number,
  height: number,
  tempPaths: string,
  targetIndex: number,
  drive: string,
  taskId?: string
) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    const res = await invokeBaseApi.screenDiffTemplates(      x,
      y,
      width,
      height,
      tempPaths,
      targetIndex,
      drive);
    return res;
  } catch (error) {
    console.error("screenDiffTemplatesFnError:", error);
  }
};
