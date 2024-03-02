import { invoke } from "@tauri-apps/api";

export const combinedFn = async (keys: Key[], taskId?: string) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    const result = await invoke<string>("press_keys", {
      keys,
    });
    const json = JSON.parse(result) as {
      code: number;
      message: string;
    };
    return json;
  } catch (error) {
    console.error("combinedFnError:", error);
  }
};
