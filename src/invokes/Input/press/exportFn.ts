import { invoke } from "@tauri-apps/api";

export const pressFn = async (key: Key, taskId?: string) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    const result = await invoke<string>("press_key", {
      key,
    });
    const json = JSON.parse(result) as {
      code: number;
      message: string;
    };
    return json;
  } catch (error) {
    console.error("pressFnError:", error);
  }
};
