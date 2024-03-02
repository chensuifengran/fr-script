import { invoke } from "@tauri-apps/api/tauri";

export const moveFn = async (
  x: number,
  y: number,
  isRelative = false,
  taskId?: string
) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    if (isRelative) {
      await invoke("mouse_move_relative", {
        x,
        y,
      });
    } else {
      await invoke("mouse_move_to", {
        x,
        y,
      });
    }
    return true;
  } catch (e) {
    console.error("moveFnError:", e);
    return false;
  }
};
