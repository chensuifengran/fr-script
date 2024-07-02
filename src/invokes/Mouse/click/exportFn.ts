import { computePosition } from "../OptionUtil";

export const clickFn = async (
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
    const res = await invokeBaseApi.click(targetPos.x, targetPos.y, button);
    return res;
  } catch (error) {
    console.error("clickFnError:", error);
    return false;
  }
};
