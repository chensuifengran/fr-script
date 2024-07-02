import { computePosition } from "../OptionUtil";

export const moveFn = async (
  x: number,
  y: number,
  isRelative = false,
  taskId?: string
) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return false;
  }
  try {
    const targetPos = await computePosition(x, y);
    const res = await invokeBaseApi.move(targetPos.x, targetPos.y, isRelative);
    return res;
  } catch (e) {
    console.error("moveFnError:", e);
    return false;
  }
};
