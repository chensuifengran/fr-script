import { invoke } from "@tauri-apps/api";

export const screenMatchTemplateFn = async (
  x: number,
  y: number,
  width: number,
  height: number,
  tempPath: string,
  exactValue = 0.0,
  scale = 0.0,
  drive = "auto",
  taskId?: string
) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    const res = await invoke<string>("screen_match_template", {
      x,
      y,
      width,
      height,
      tempPath,
      exactValue,
      scale,
      drive: drive === "auto" ? undefined : drive,
    });
    return JSON.parse(res) as { x: number; y: number };
  } catch (error) {
    console.error("screenMatchTemplateFnError:", error);
  }
};
