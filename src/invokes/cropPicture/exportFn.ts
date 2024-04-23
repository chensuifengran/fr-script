export const cropPictureFn = async (
  path: string,
  x: number,
  y: number,
  width: number,
  height: number,
  outPath: string,
  taskId?: string
) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return -2;
  }
  try {
    const res = await invokeBaseApi.cropPicture(
      path,
      x,
      y,
      width,
      height,
      outPath
    );
    return res;
  } catch (e) {
    console.error(e);
    return -1;
  }
};
