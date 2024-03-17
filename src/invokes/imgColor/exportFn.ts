import { invoke } from "@tauri-apps/api";
import { ColorUtil } from "../screenColor/ColorUtil";

export const imgColorFn = async (
  path: string,
  x: number = 0,
  y: number = 0,
  taskId?: string
): Promise<ColorUtil | undefined> => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    const res = await invoke<string>("img_color", {
      path,
      x,
      y,
    });
    const json = JSON.parse(res);
    if (json.message === "success") {
      return new ColorUtil(json.data as [number, number, number], () =>
        imgColorFn(path, x, y, taskId)
      );
    }
    return;
  } catch (e) {
    console.error("imgColorError: ", e);
  }
};
