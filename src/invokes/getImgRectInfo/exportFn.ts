import { exists } from "@tauri-apps/plugin-fs";
export const getImgRectInfoFn = async (imgPath: string, taskId?: string) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return {
      startX: -2,
      startY: -2,
      width: -2,
      height: -2,
    };
  }
  try {
    const isExists = await exists(imgPath);
    if (!isExists) {
      console.error(`getImgRectInfoFn 文件不存在: ${imgPath}`);
      return null;
    }
    const res = await invokeBaseApi.getImgRectInfo(imgPath);
    return res as {
      startX: number;
      startY: number;
      width: number;
      height: number;
    };
  } catch (e) {
    console.error(e);
    return {
      startX: -1,
      startY: -1,
      width: -1,
      height: -1,
    };
  }
};
