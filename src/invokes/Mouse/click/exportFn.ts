import { invoke } from "@tauri-apps/api";

export const clickFn = async (
  x: number,
  y: number,
  button: "left" | "middle" | "right" = "left",
  taskId?: string
) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  x = Math.round(x);
  y = Math.round(y);
  try {
    if (button === "left") {
      await invoke("mouse_move_click", {
        x,
        y,
        button: 0,
      });
    } else if(button === 'middle') {
      await invoke("mouse_move_click", {
        x,
        y,
        button: 1,
      });
    }else{
      await invoke("mouse_move_click", {
        x,
        y,
        button: 2,
      });
    }
  } catch (error) {
    console.error("clickFnError:", error);
  }
};