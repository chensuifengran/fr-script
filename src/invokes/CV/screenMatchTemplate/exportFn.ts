import { invoke } from "@tauri-apps/api";
import { MatchUtil } from "../matchTemplate/MatchUtil";

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
    const {x:_x, y:_y} = JSON.parse(res) as {
      x: number;
      y: number;
    };
    return new MatchUtil(_x, _y);
  } catch (error) {
    console.error("screenMatchTemplateFnError:", error);
  }
};
