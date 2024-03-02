import { invoke } from "@tauri-apps/api";

export const clickerFn = async (
  duration: number,
  sleep: number,
  taskId?: string
) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return async ()=>{};
  }
  try {
    if (duration < 0) {
      duration = 0;
    }
    if (sleep < 0) {
      sleep = 0;
    }
    await invoke("start_clicker", {
      duration,
      sleep,
    });
    return async () => {
      await invoke("stop_clicker");
    };
  } catch (error) {
    console.error("clickFnError:", error);
  }
  return async ()=>{};
};
