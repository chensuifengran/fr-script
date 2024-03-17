import { invoke } from "@tauri-apps/api";
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
    let res;
    if (x !== -1 && y !== -1) {
      res = await invoke<string>("screen_color", {
        x,
        y,
      });
    } else {
      res = await invoke<string>("screen_color");
    }

    const json = JSON.parse(res);
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
