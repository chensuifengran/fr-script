import { invoke } from "@tauri-apps/api";

export const keyUpFn = async (key:Key, taskId?: string) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    const result = await invoke<string>("key_up", {
      key,
    });
    const json = JSON.parse(result) as {
      code: number;
      message: string;
    };
    return json;
  } catch (error) {
    console.error("keyUpFnError:", error);
  }
};
export type KeyUpFnType = typeof keyUpFn;
