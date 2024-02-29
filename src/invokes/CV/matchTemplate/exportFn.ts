import { invoke } from "@tauri-apps/api";

export const matchTemplateFn = async (
  imgPath: string,
  tempPath: string,
  exactValue = 0.0,
  scale = 0.0,
  taskId?: string
) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    const res = await invoke<string>("match_template", {
      imgPath,
      tempPath,
      exactValue,
      scale,
    });
    return JSON.parse(res) as { x: number; y: number };
  } catch (error) {
    console.error("matchTemplateFnError:", error);
  }
};
export type MatchTemplateFnType = typeof matchTemplateFn;
