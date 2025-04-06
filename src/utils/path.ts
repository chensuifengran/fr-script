import { invoke } from "@tauri-apps/api/core";
import {
  basename,
  dirname,
  extname,
  join as pJoin,
  resolve as pResolve,
} from "@tauri-apps/api/path";

const join = async (path: string, addPath?: string) => {
  if (!addPath) return await pJoin(path);
  const mod = addPath.includes("\\");
  let paths = [];
  if (mod) {
    paths = addPath.split("\\");
  } else if (addPath.includes("/")) {
    paths = addPath.split("/");
  } else {
    paths = [addPath];
  }
  if (IS_PLAYGROUND_ENV) {
    return [path, ...paths].join("\\\\");
  }
  return await pJoin(path, ...paths);
};

const resolve = async (path: string, addPath: string) => {
  const mod = addPath.includes("\\");
  let paths = [];
  if (mod) {
    paths = addPath.split("\\");
  } else if (addPath.includes("/")) {
    paths = addPath.split("/");
  } else {
    paths = [addPath];
  }
  if (IS_PLAYGROUND_ENV) {
    return [path, ...paths].join("\\\\");
  }
  return await pResolve(path, ...paths);
};

const getInstallDir = async () => {
  if (IS_PLAYGROUND_ENV) {
    return "";
  }
  return (await invoke("get_install_dir")) as string;
};

const _basename = async (path: string, ext?: string) => {
  const mod = path.includes("\\");
  if (IS_PLAYGROUND_ENV) {
    if (mod) {
      let res = path.split("\\").pop();
      if (ext) {
        res = res?.replace(ext, "");
      }
      return res;
    } else {
      let res = path.split("/").pop();
      if (ext) {
        res = res?.replace(ext, "");
      }
      return res;
    }
  }
  return await basename(path, ext);
};

const _dirname = async (path: string) => {
  const mod = path.includes("\\");
  if (IS_PLAYGROUND_ENV) {
    if (mod) {
      return path.split("\\").slice(0, -1).join("\\");
    } else {
      return path.split("/").slice(0, -1).join("/");
    }
  }
  return await dirname(path);
};

const _extname = async (path: string) => {
  const mod = path.includes("\\");
  if (IS_PLAYGROUND_ENV) {
    if (mod) {
      return path.split("\\").pop()?.split(".").pop();
    } else {
      return path.split("/").pop()?.split(".").pop();
    }
  }
  return await extname(path);
};

export const pathUtils = {
  basename: _basename,
  dirname: _dirname,
  extname: _extname,
  join,
  resolve,
  getInstallDir,
};
