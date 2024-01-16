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

export const decompress = async (
  path: string,
  targetPath: string,
  delOriginFile: boolean
): Promise<boolean> => {
  try {
    console.log('decompress_dep_file',path, targetPath, delOriginFile);
    
    const info = JSON.parse(
      await invoke("decompress_dep_file", { path, targetPath, delOriginFile })
    );
    console.log('decompress_dep_file',info);
    
    if (info.code === 200) {
      return true;
    } else {
      console.error(info.message);
    }
  } catch (error) {
    console.error(error);
    return false;
  }
  return false;
};

export const copy = async (
  sourcePath: string,
  targetPath: string,
  delOriginFile: boolean,
  overwrite: boolean
): Promise<boolean> => {
  try {
    const info = JSON.parse(
      await invoke("copy_dep_file", { sourcePath, targetPath, delOriginFile, overwrite })
    );
    if (info.code === 200) {
      return true;
    } else {
      console.error(info.message);
    }
  } catch (error) {
    console.error(error);
    return false;
  }
  return false;
};

export const fsUtils = {
  getFileInfo,
  decompress,
  copy,
};
