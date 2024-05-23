export const downFn = async (
  x: number,
  y: number,
  button: "left" | "middle" | "right" = "left",
  taskId?: string
) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return false;
  }
  try {
    await invokeBaseApi.mouseDown(x, y, button);
    return true;
  } catch (error) {
    console.error("clickFnError:", error);
    return false;
  }
};
