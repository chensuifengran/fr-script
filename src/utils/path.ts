import { invoke } from "@tauri-apps/api";
import {
  basename,
  join as pJoin,
  resolve as pResolve,
} from "@tauri-apps/api/path";


const join = async (path: string, addPath?: string) => {
  if(!addPath) return await pJoin(path);
  const mod = addPath.includes("\\");
  let paths = [];
  if (mod) {
    paths = addPath.split("\\");
  } else if (addPath.includes("/")) {
    paths = addPath.split("/");
  } else {
    paths = [addPath];
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
  return await pResolve(path, ...paths);
};

const getInstallDir = async () => {
  return (await invoke("get_install_dir")) as string;
};


export const pathUtils = {


  basename,
  join,
  resolve,
  getInstallDir,

};
