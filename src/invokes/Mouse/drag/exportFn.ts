export const dragFn = async (
  x: number,
  y: number,
  toX: number,
  toY: number,
  duration?: number,
  taskId?: string
) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return false;
  }
  try {
    const res = await invokeBaseApi.drag(x, y, toX, toY, duration);
    return res;
  } catch (e) {
    console.error("dragFnError:", e);
    return false;
  }
};
