import { MatchUtil } from "./MatchUtil";

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
    const { x, y } = await invokeBaseApi.matchTemplate(
      imgPath,
      tempPath,
      exactValue,
      scale
    );
    return new MatchUtil(x, y);
  } catch (error) {
    console.error("matchTemplateFnError:", error);
  }
};
