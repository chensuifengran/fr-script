import { computePosition } from "../OptionUtil";

export const upFn = async (
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
    const targetPos = await computePosition(x, y);
    const res = await invokeBaseApi.mouseUp(targetPos.x, targetPos.y, button);
    return res;
  } catch (error) {
    console.error("upFnError:", error);
    return false;
  }
};
