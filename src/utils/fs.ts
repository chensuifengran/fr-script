import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from "@tauri-apps/api/path";

import { DialogFilter, open, save } from "@tauri-apps/plugin-dialog";
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
    const info = JSON.parse(
      await invoke("decompress_dep_file", { path, targetPath, delOriginFile })
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

export const copy = async (
  sourcePath: string,
  targetPath: string,
  delOriginFile: boolean,
  overwrite: boolean
): Promise<boolean> => {
  try {
    const info = JSON.parse(
      await invoke("copy_dep_file", {
        sourcePath,
        targetPath,
        delOriginFile,
        overwrite,
      })
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
const readFile = async (path: string) => {
  return (await invoke("read_file", { path })) as string;
};
const writeFile = async (path: string, content: string) => {
  return (await invoke("write_file", { path, content })) as string;
};
const selectFile = async (multiple = true, filters?: DialogFilter[]) => {
  const appGSStore = useAppGlobalSettings();
  const result = await open({
    multiple,
    filters,
    directory: false,
    defaultPath: appGSStore.envSetting.workDir || (await appDataDir()),
  });
  return result as string | string[] | null;
};
const selectDir = async () => {
  const appGSStore = useAppGlobalSettings();
  const result = (await open({
    multiple: false,
    directory: true,
    defaultPath: appGSStore.envSetting.workDir || (await appDataDir()),
  })) as string;
  return result;
};
const saveFile = async (targetPath: string) => {
  const result = (await save({
    defaultPath: targetPath,
  })) as string;
  return result;
};
const readDir = async (path: string) => {
  return JSON.parse(await invoke("read_dir", { path })) as {
    fileName: string;
    fileType: "file" | "dir";
  }[];
};
const deleteFile = async (path: string) => {
  try {
    await invoke("delete_file", {
      path,
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
/**
 * @description 移动子文件到新目录
 * @param sourceDir 源目录
 * @param targetDir 目标目录
 * @param overwrite 是否覆盖
 * @param removeSourceDir 是否删除源目录
 * @returns 是否成功
 */
const moveChildToNewDir = async (
  sourceDir: string,
  targetDir: string,
  overwrite: boolean = true,
  removeSourceDir: boolean = true
): Promise<boolean> => {
  try {
    const info = JSON.parse(
      await invoke("move_child_to_new_dir", {
        sourceDir,
        targetDir,
        overwrite,
        removeSourceDir,
      })
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

const deleteDir = async (
  path: string,
  force: boolean,
  acceptError: boolean = false
) => {
  try {
    await invoke("delete_dir", {
      path,
      force,
    });
    return true;
  } catch (error) {
    if (!acceptError) {
      console.error(error, path);
    }
    return false;
  }
};
export const fsUtils = {
  getFileInfo,
  decompress,
  copy,
  selectFile,
  selectDir,
  saveFile,
  readFile,
  writeFile,
  readDir,
  deleteFile,
  deleteDir,
  moveChildToNewDir,
};
