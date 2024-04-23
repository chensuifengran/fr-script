import { ColorUtil } from "./ColorUtil";
export const screenColorFn = async (
  x: number = -1,
  y: number = -1,
  taskId?: string
): Promise<ColorUtil | undefined> => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    const _x = x === -1 ? undefined : x;
    const _y = y === -1 ? undefined : y;
    const json = await invokeBaseApi.screenColor(_x, _y);
    if (json.message === "success") {
      return new ColorUtil(json.data as [number, number, number], () =>
        screenColorFn(x, y, taskId)
      );
    }
    return;
  } catch (e) {
    console.error("screenColorError: ", e);
  }
};
