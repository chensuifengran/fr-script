import { invoke } from "@tauri-apps/api";

export const wheelFn = async (delta: number, taskId?: string) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    const res = await invoke("mouse_wheel", {
      delta,
    });
    return res;
  } catch (error) {
    console.error("wheelFnError:", error);
  }
};
