export const randomMoveFn = async (
  x: number,
  y: number,
  randomRange: [[number, number], [number, number]] = [
    [0, 0],
    [0, 0],
  ],
  taskId?: string
) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return false;
  }
  try {
    const [lX, hX] = randomRange[0]; //x轴最小偏移和最大偏移，可能为负数
    const [lY, hY] = randomRange[1]; //y轴最小偏移和最大偏移，可能为负数
    let targetPos = {
      x,y
    };
    if(!(lX === 0 && hX === 0)){
      targetPos.x += Math.round(lX + Math.random() * (hX - lX));
    }
    if(!(lY === 0 && hY === 0)){
      targetPos.y += Math.round(lY + Math.random() * (hY - lY));
    }
    const res = await invokeBaseApi.move(x, y);
    return res;
  } catch (e) {
    console.error(e);
    return false;
  }
};
