import { invoke } from "@tauri-apps/api/tauri";

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
    return;
  }
  try {
    await invoke("mouse_drag", {
      x,
      y,
      toX,
      toY,
      duration,
    });
    return true;
  } catch (e) {
    console.error("dragFnError:", e);
    return false;
  }
};
