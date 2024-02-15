import { invoke } from "@tauri-apps/api";

export const getImageSizeFn = async (path: string, taskId?: string) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    const res = await invoke<string>("get_img_size", {
      path,
    });
    return JSON.parse(res);
  } catch (e) {
    console.error(e);
    return null;
  }
};
export type GetImageSizeFnType = (path: string) => Promise<{
  width: number;
  height: number;
}>;
