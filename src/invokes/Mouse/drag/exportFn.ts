import { computePosition } from "../OptionUtil";

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
  if(toX < 0 || toY < 0){
    console.error('只有起点坐标可以使用负数代表鼠标当前位置');
    return false;
  }
  try {
    const originPos =
      x < 0 || y < 0 ? { x: -1, y: -1 } : await computePosition(x, y);
    const targetPos = await computePosition(toX, toY);
    const res = await invokeBaseApi.drag(
      originPos.x,
      originPos.y,
      targetPos.x,
      targetPos.y,
      duration
    );
    return res;
  } catch (e) {
    console.error("dragFnError:", e);
    return false;
  }
};
