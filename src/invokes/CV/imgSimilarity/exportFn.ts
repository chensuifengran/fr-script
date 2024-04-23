export const imgSimilarityFn = async (
  pathA: string,
  pathB: string,
  x: number = -1,
  y: number = -1,
  width: number = -1,
  height: number = -1,
  taskId?: string
) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return -2;
  }
  try {
    const res = await invokeBaseApi.imgSimilarity(
      pathA,
      pathB,
      x,
      y,
      width,
      height,
    );
    return res;
  } catch (e) {
    console.error(e);
    return -1;
  }
};
