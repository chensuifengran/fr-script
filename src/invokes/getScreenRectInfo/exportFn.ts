import { invoke } from "@tauri-apps/api";
export const getScreenRectInfoFn = async (delayTime = 0, taskId?: string) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    await new Promise((resolve) => setTimeout(resolve, delayTime));
    const res = await invoke<string>("get_screen_rect_info");
    return JSON.parse(res);
  } catch (e) {
    console.error(e);
  }
};
