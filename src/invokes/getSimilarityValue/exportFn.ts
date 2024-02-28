import { invoke } from "@tauri-apps/api";
export const getSimilarityValueFn = async (
  pathA: string,
  pathB: string,
  x: number = -1,
  y: number = -1,
  width: number = -1,
  height: number = -1,
  taskId?: string
) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    const res = await invoke<number>("get_similarity_value", {
      pathA,
      pathB,
      x,
      y,
      width,
      height,
    });
    return res;
  } catch (e) {
    console.error(e);
    return -1;
  }
};
export type GetSimilarityValueFnType = typeof getSimilarityValueFn;
