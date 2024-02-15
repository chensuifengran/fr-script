import { invoke } from "@tauri-apps/api";
import { exists } from "@tauri-apps/api/fs";
export const getImgRectInfoFn = async (imgPath: string, taskId?: string) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    const isExists = await exists(imgPath);
    if (!isExists) {
      console.error(`文件不存在: ${imgPath}`);
      return null;
    }
    const res = await invoke<string>("get_img_rect_info", {
      imgPath,
    });
    return JSON.parse(res);
  } catch (e) {
    console.error(e);
    return null;
  }
};
export type GetImgRectInfoFnType = typeof getImgRectInfoFn;
