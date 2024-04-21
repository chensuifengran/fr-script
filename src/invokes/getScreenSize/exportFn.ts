import { invoke } from "@tauri-apps/api";

export const getScreenSizeFn = async (taskId?: string) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return {
      width: -1,
      height: -1,
    };
  }
  try {
    const res = await invoke<string>("get_screen_size");
    return JSON.parse(res) as {
      width: number;
      height: number;
    };
  } catch (e) {
    console.error(e);
    return {
      width: -1,
      height: -1,
    };
  }
};
