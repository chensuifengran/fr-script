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
    x =
      x +
      Math.floor(
        Math.random() * (randomRange[0][1] - randomRange[0][0]) +
          randomRange[0][0]
      );
    y =
      y +
      Math.floor(
        Math.random() * (randomRange[1][1] - randomRange[1][0]) +
          randomRange[1][0]
      );
    const res = await invokeBaseApi.move(x, y);
    return res;
  } catch (e) {
    console.error(e);
    return false;
  }
};
