import { invoke } from "@tauri-apps/api";

const getFileInfo = async (
  path: string
): Promise<
  | {
      fileName: string;
      fileSize: number;
      fileType: "file" | "dir";
    }
  | undefined
> => {
  try {
    const info = JSON.parse(await invoke("get_file_info", { filePath: path }));
    if (info.code === 200) {
      return JSON.parse(info.message) as {
        fileName: string;
        fileSize: number;
        fileType: "file" | "dir";
      };
    } else {
      console.error(info.message);
    }
  } catch (error) {
    console.error(error);
  }
};
export const fsUtils = {
  getFileInfo,
};
