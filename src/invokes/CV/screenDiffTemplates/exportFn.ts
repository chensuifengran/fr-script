export const screenDiffTemplatesFn = async (
  x: number,
  y: number,
  width: number,
  height: number,
  tempPaths: string[],
  targetIndex: number,
  taskId?: string
) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    const res = await invokeBaseApi.screenDiffTemplates(
      x,
      y,
      width,
      height,
      tempPaths.join("|"),
      targetIndex
    );
    return res;
  } catch (error) {
    console.error("screenDiffTemplatesFnError:", error);
  }
};
