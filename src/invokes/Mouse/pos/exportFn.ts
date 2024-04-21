import { invoke } from "@tauri-apps/api";

export const posFn = async (taskId?: string) => {
  
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return {
      x: -1,
      y: -1
    };
  }
  try {
    const res = await invoke<string>("mouse_get_pos");
    return (JSON.parse(res) as any).message as { x: number; y: number };
  } catch (e) {
    console.error(e);
    return {
      x: -1,
      y: -1
    };
  }
};
