import { invoke } from "@tauri-apps/api";

export const textFn = async (text: string, taskId?: string) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    const result = await invoke<string>("input_text", {
      text,
    });
    const json = JSON.parse(result) as {
      code: number;
      message: string;
    };
    return json;
  } catch (error) {
    console.error("textFnError:", error);
  }
};
