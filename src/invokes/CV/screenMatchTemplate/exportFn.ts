import { MatchUtil } from "../matchTemplate/MatchUtil";

export const screenMatchTemplateFn = async (
  x: number,
  y: number,
  width: number,
  height: number,
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
    const { x: _x, y: _y } = await invokeBaseApi.screenMatchTemplate(
      x,
      y,
      width,
      height,
      tempPath,
      exactValue,
      scale
    );
    return new MatchUtil(_x, _y);
  } catch (error) {
    console.error("screenMatchTemplateFnError:", error);
  }
};
