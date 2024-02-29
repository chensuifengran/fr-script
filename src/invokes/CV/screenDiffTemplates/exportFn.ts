import { invoke } from "@tauri-apps/api";

export const screenDiffTemplatesFn = async (
  x: number,
  y: number,
  width: number,
  height: number,
  tempPaths: string,
  targetIndex: number,
  drive: string,
  taskId?: string
) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    const res = await invoke<string>("screen_diff_template", {
      x,
      y,
      width,
      height,
      tempPaths,
      targetIndex,
      drive: drive==='auto' ? undefined : drive,
    });
    return JSON.parse(res) as { x: number; y: number };
  } catch (error) {
    console.error("screenDiffTemplatesFnError:", error);
  }
};
export type ScreenDiffTemplateFnType = typeof screenDiffTemplatesFn;
