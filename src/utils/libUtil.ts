import { getVersion } from "@tauri-apps/api/app";
import { exists, renameFile } from "@tauri-apps/api/fs";
import { invoke } from "@tauri-apps/api";
import {
  CheckDepItemType,
  DepPkgItemType,
  DependenceItemType,
  LibNameItemType,
  NeedUpdateDepType,
  VersionItemType,
} from "../types/lib";
import { storeToRefs } from "pinia";
let lastLiblist: LibNameItemType[] = [];
let lastDepPkg: DepPkgItemType[] = [];

const renameLib = async (name: string, targetName: string) => {
  try {
    const installPath = await pathUtils.getInstallDir();
    const libPath = await pathUtils.join(installPath, name);
    const targetPath = await pathUtils.join(installPath, targetName);
    await renameFile(libPath, targetPath);
  } catch (error) {
    console.error("库文件重命名失败：", error);
  }
};

const diffLocalVersionConfig = async (checkList?: CheckDepItemType[]) => {
  if (!checkList) {
    checkList = await checkLibs();
  }
  const localValue = localStorage.getItem("localDependentVersion");
  if (localValue) {
    const localInfos: VersionItemType[] = JSON.parse(localValue);
    const resultList: NeedUpdateDepType[] = [];
    for (const localInfo of localInfos) {
      const checkItem = checkList.find((i) => i.name === localInfo.name);
      if (checkItem) {
        if (localInfo.version !== checkItem.version) {
          const dlls = ["screenOperation.dll","ppocr.dll", "g_ppocr.dll"]
          if(dlls.includes(checkItem.name)){
            try {
              const dllVersion = await invoke<string>("get_dependence_version");
              const v = dllVersion.split("-");
              if(checkItem.name === "screenOperation.dll" && v[1] === checkItem.version){
                const target = localInfos.find(i => i.name === checkItem.name);
                if(target){
                  target.version = v[1];
                  localStorage.setItem("localDependentVersion", JSON.stringify(localInfos));
                }
                continue;
              }else if(v[0] === checkItem.version){
                const target = localInfos.find(i => i.name === checkItem.name);
                if(target){
                  target.version = v[0];
                  localStorage.setItem("localDependentVersion", JSON.stringify(localInfos));
                }
                continue;
              }
            } catch (error) {
              console.log('diffLocalVersionConfig error:', error);
            }
          }
          resultList.push({
            name: checkItem.name,
            version: checkItem.version,
            download_url: checkItem.downloadUrl,
            currentVersion: localInfo.version,
          });
        }
        if (localInfo.children) {
          for (const localChild of localInfo.children) {
            const checkChild = checkItem.children.find(
              (i) => i.name === localChild.name
            );
            if (checkChild) {
              if (localChild.version !== checkChild.version) {
                resultList.push({
                  name: checkChild.name,
                  version: checkChild.version,
                  download_url: checkChild.downloadUrl,
                  currentVersion: localChild.version,
                });
              }
            }
          }
        }
      }
    }
    return resultList;
  } else {
    await syncLocalDepVersion(checkList);
    return [];
  }
};
const syncLocalDepVersion = async (checkList: CheckDepItemType[]) => {
  const currentVersionInfo = checkList
    .map((i) => {
      if (!i.exists) {
        return null;
      }
      return {
        name: i.name,
        version: i.version,
        children: i.children
          .map((j) => {
            if (!j.exists) {
              return null;
            }
            return {
              name: j.name,
              version: j.version,
            };
          })
          .filter((i) => i),
      };
    })
    .filter((i) => i);
  localStorage.setItem(
    "localDependentVersion",
    JSON.stringify(currentVersionInfo)
  );
};

const syncDependentVersion = async (checkList?: CheckDepItemType[]) => {
  if (!checkList) {
    checkList = await checkLibs();
  }
  const needUpdateInfo = await diffLocalVersionConfig(checkList);
  const appGSStore = useAppGlobalSettings();
  const { app } = storeToRefs(appGSStore);
  const { lackDependence } = useDepInfo();
  if (needUpdateInfo.length > 0) {
    app.value.depHaveUpdate = true;
  } else {
    app.value.depHaveUpdate = false;
  }
  const lackDeps = await checkDepLack();
  if (lackDeps.length > 0) {
    lackDependence.splice(0, lackDependence.length, ...lackDeps);
  }
  return needUpdateInfo;
};

const syncOcrValue = async () => {
  const info = await libExists("paddle_inference.dll");
  if (info) {
    const size = info.fileSize;
    return size / 1024000 < 100 ? "CPU" : "GPU";
  }
};

const libExists = async (name: string) => {
  const installPath = await pathUtils.getInstallDir();
  const libPath = await pathUtils.join(installPath, name);
  if (await exists(libPath)) {
    return fsUtils.getFileInfo(libPath);
  }
};
const pushUpdateDep = async(path:string)=>{
  const installPath = await pathUtils.getInstallDir();
  const libPath = await pathUtils.join(installPath,".wait_update");
  await fsUtils.copy(path, libPath, false, true);
}

const batchUpdateDep = async()=>{
  const installPath = await pathUtils.getInstallDir();
  const waitUpdateDeps = await pathUtils.join(installPath,".wait_update");
  const depList = await fsUtils.readDir(waitUpdateDeps);
  for(const dep of depList){
    const depPath = await pathUtils.join(waitUpdateDeps,dep.fileName);
    await fsUtils.copy(depPath,installPath,true,true);
  }
}


const checkDepList = async (depList: DependenceItemType[]) => {
  const resultList: LibNameItemType[] = [];
  for (const dep of depList) {
    if (dep.decompression) {
      let lackDep = false;
      for (const child of dep.child_files) {
        const path = dep.root_path ? dep.root_path + "/" + child : child;
        const childInfo = await libExists(path);
        if (!childInfo) {
          lackDep = true;
          break;
        }
      }
      resultList.push({
        name: dep.name,
        exists: !lackDep,
        downloadUrl: dep.download_url,
        children: [],
        version: dep.version,
        child_files: dep.child_files,
        root_path: dep.root_path,
      });
    } else {
      resultList.push({
        name: dep.name,
        exists: await libExists(dep.name),
        downloadUrl: dep.download_url,
        children: [],
        version: dep.version,
        root_path: dep.root_path,
        child_files: dep.child_files,
      });
    }
  }
  return resultList;
};

/**
 * 获取最新依赖库信息，同时对依赖文件进行检查
 * 返回结果为一个数组，数组中的每一项为一个依赖库的检查结果，包含以下属性：
 * name: 依赖库名称
 * exists: 依赖库在本地是否存在
 * downloadUrl: 依赖库下载地址
 * children: 依赖库的子依赖库检查结果
 */
const checkLibs = async () => {
  const libInfo = await appConfigApi.getDepInfo();
  const currentVersion = await getVersion();
  //找到适合当前版本的依赖
  const suitableDep = libInfo.find((i: any) => {
    return i.suitable_app_version.includes(currentVersion);
  });
  if (suitableDep) {
    lastDepPkg = suitableDep.dep_pkg;
    const checkList: LibNameItemType[] = [];
    for (const dep of suitableDep.dependence) {
      checkList.push({
        exists: await libExists(dep.name),
        downloadUrl: dep.download_url,
        name: dep.name,
        children: await checkDepList(dep.dependence),
        version: dep.version,
        child_files: dep.child_files.map((i: string) =>
          dep.root_path ? dep.root_path + "/" + i : i
        ),
      });
    }
    lastLiblist = checkList;
    return checkList;
  }
  return [];
};

//在checkLibs返回的结果中，提取出所有依赖库的名称
const getAllLibsName = async (checkList: LibNameItemType[]) => {
  const libNames: string[] = [];

  for (const item of checkList) {
    libNames.push(item.name);
    if (item.children) {
      for (const child of item.children) {
        if (child.child_files) {
          libNames.push(
            item.name + "->" + child.name + "->" + child.child_files.join(",")
          );
        } else {
          libNames.push(item.name + "->" + child.name);
        }
      }
    }
  }
  for (const item of lastDepPkg) {
    libNames.push(item.name);
  }
  return libNames;
};

const getDepState = async (
  list: CheckDepItemType[],
  depName: string,
  childFiles?: string[]
) => {
  const dep = list.find((i) => i.name === depName);
  if (dep) {
    if (!dep.exists) {
      if (dep.name === "g_ppocr.dll") {
        const ppocrExists = await libExists("ppocr.dll");
        const c_ppocrExists = await libExists("c_ppocr.dll");
        return !!ppocrExists && !!c_ppocrExists;
      }
      if (childFiles) {
        let exists = true;
        for (const child of childFiles) {
          const childInfo = await libExists(child);
          if (!childInfo) {
            exists = false;
            break;
          }
        }
        return exists;
      }
      return false;
    } else {
      let result = true;
      for (const child of dep.children) {
        if (!child.exists) {
          result = false;
          break;
        }
      }
      return result;
    }
  } else {
    ElMessage({
      message: "依赖获取失败，请检查网络连接正常后重试！",
      type: "error",
      showClose: true,
      grouping: true,
    });
    return false;
  }
};

const syncDepState = async (checkList: CheckDepItemType[]) => {
  //依赖名为screenOperation.dll的依赖库及子依赖库均存在时为：精简版
  //在精简版的基础上，依赖名为ppocr.dll的依赖库及子依赖库均存在时为：基础版
  //在基础班的基础上，依赖名为g_ppocr.dll的依赖库及子依赖库均存在时为：完整版

  const resultMap: Record<string, boolean> = {};
  for (const dep of checkList) {
    resultMap[dep.name] = await getDepState(
      checkList,
      dep.name,
      dep.child_files
    );
  }

  let version: "完整版" | "基础版" | "精简版" | "不可用" = "不可用";
  if (
    resultMap["screenOperation.dll"] &&
    resultMap["adb.7z"] &&
    resultMap["ppocr.dll"] &&
    resultMap["g_ppocr.dll"]
  ) {
    version = "完整版";
  } else if (
    resultMap["screenOperation.dll"] &&
    resultMap["adb.7z"] &&
    resultMap["ppocr.dll"]
  ) {
    version = "基础版";
  } else if (resultMap["screenOperation.dll"] && resultMap["adb.7z"]) {
    version = "精简版";
  }
  const appGSStore = useAppGlobalSettings();
  const { app } = storeToRefs(appGSStore);
  app.value.dependenceState = version;
};

const checkDepUpdate = async () => {
  const checkList = await checkLibs();
  if (checkList.length === 0) {
    ElNotification({
      title: "获取依赖信息失败",
      message: "没有适合当前版本的依赖库信息",
      type: "error",
      position: "bottom-right",
      showClose: true,
    });
    return;
  }
  //同步依赖状态
  await syncDepState(checkList);
  //同步依赖最新版本
  const needUpdateInfo = await syncDependentVersion(checkList);

  const allNames = await getAllLibsName(checkList);
  const { allLibsName, needUpdateDepList } = useDepInfo();
  allLibsName.value = allNames;
  needUpdateDepList.value = needUpdateInfo;
  await syncDepPkgList();
};

/**
 * 根据当前状态检查距离后面的状态缺少哪些依赖库
 *  */
const checkDepLack = async () => {
  const checkList = await checkLibs();
  const appGSStore = useAppGlobalSettings();
  const state = appGSStore.app.dependenceState;
  const simpleStateLackDeps: NeedUpdateDepType[] = [];
  const baseStateLackDeps: NeedUpdateDepType[] = [];
  const fullStateLackDeps: NeedUpdateDepType[] = [];
  const simpleDep = checkList.find((i) => i.name === "screenOperation.dll");
  const simpleAdbDep = checkList.find((i) => i.name === "adb.7z");
  const baseDep = checkList.find((i) => i.name === "ppocr.dll");
  const fullDep = checkList.find((i) => i.name === "g_ppocr.dll");
  if (state === "不可用") {
    if (simpleDep && simpleAdbDep && baseDep && fullDep) {
      if (!simpleDep.exists) {
        simpleStateLackDeps.push({
          name: simpleDep.name,
          version: simpleDep.version,
          download_url: simpleDep.downloadUrl,
        });
      }
      if (!simpleAdbDep.exists) {
        simpleStateLackDeps.push({
          name: simpleAdbDep.name,
          version: simpleAdbDep.version,
          download_url: simpleAdbDep.downloadUrl,
        });
      }
      if (!baseDep.exists) {
        baseStateLackDeps.push({
          name: baseDep.name,
          version: baseDep.version,
          download_url: baseDep.downloadUrl,
        });
      }
      if (!fullDep.exists) {
        fullStateLackDeps.push({
          name: fullDep.name,
          version: fullDep.version,
          download_url: fullDep.downloadUrl,
        });
      }
      if (simpleDep.children) {
        for (const child of simpleDep.children) {
          if (!child.exists) {
            simpleStateLackDeps.push({
              name: child.name,
              version: child.version,
              download_url: child.downloadUrl,
            });
          }
        }
      }
      if (baseDep.children) {
        for (const child of baseDep.children) {
          if (!child.exists) {
            baseStateLackDeps.push({
              name: child.name,
              version: child.version,
              download_url: child.downloadUrl,
            });
          }
        }
      }
      if (fullDep.children) {
        for (const child of fullDep.children) {
          if (!child.exists) {
            fullStateLackDeps.push({
              name: child.name,
              version: child.version,
              download_url: child.downloadUrl,
            });
          }
        }
      }
    } else {
      ElMessage({
        message: "依赖获取失败，请检查网络连接正常后重试！",
        type: "error",
        showClose: true,
        grouping: true,
      });
    }
  } else if (state === "精简版") {
    if (baseDep && fullDep) {
      if (!baseDep.exists) {
        baseStateLackDeps.push({
          name: baseDep.name,
          version: baseDep.version,
          download_url: baseDep.downloadUrl,
        });
      }
      if (!fullDep.exists) {
        fullStateLackDeps.push({
          name: fullDep.name,
          version: fullDep.version,
          download_url: fullDep.downloadUrl,
        });
      }
      if (baseDep.children) {
        for (const child of baseDep.children) {
          if (!child.exists) {
            baseStateLackDeps.push({
              name: child.name,
              version: child.version,
              download_url: child.downloadUrl,
            });
          }
        }
      }
      if (fullDep.children) {
        for (const child of fullDep.children) {
          if (!child.exists) {
            fullStateLackDeps.push({
              name: child.name,
              version: child.version,
              download_url: child.downloadUrl,
            });
          }
        }
      }
    } else {
      ElMessage({
        message: "依赖获取失败，请检查网络连接正常后重试！",
        type: "error",
        showClose: true,
        grouping: true,
      });
    }
  } else if (state === "基础版") {
    if (fullDep) {
      if (!fullDep.exists) {
        fullStateLackDeps.push({
          name: fullDep.name,
          version: fullDep.version,
          download_url: fullDep.downloadUrl,
        });
      }
      if (fullDep.children) {
        for (const child of fullDep.children) {
          if (!child.exists) {
            fullStateLackDeps.push({
              name: child.name,
              version: child.version,
              download_url: child.downloadUrl,
            });
          }
        }
      }
    } else {
      ElMessage({
        message: "依赖获取失败，请检查网络连接正常后重试！",
        type: "error",
        showClose: true,
        grouping: true,
      });
    }
  }
  await syncDepState(checkList);
  return [simpleStateLackDeps, baseStateLackDeps, fullStateLackDeps];
};

const installDep = async (
  dep: { label: string; path: string },
  delOriginFile = false,
  isFullVersionInstallBaseVersion = false,
  ocrValue: "CPU" | "GPU" = "CPU"
) => {
  const installPath = await pathUtils.getInstallDir();
  let result = false;
  if (dep.label.includes("7z")) {
    if (lastLiblist.length === 0) {
      await checkLibs();
    }
    let root_path = lastLiblist.find((i) => i.name === dep.label)?.root_path;
    if (!root_path) {
      lastLiblist.find((l) => {
        const target = l.children?.find((i) => i.name === dep.label);
        if (target) {
          root_path = target.root_path;
          return true;
        }
      });
    }
    let targetPath;
    if (root_path) {
      targetPath = await pathUtils.join(installPath, root_path);
    } else {
      targetPath = installPath;
    }
    if (
      isFullVersionInstallBaseVersion &&
      dep.label === "base_dep_pkg.7z" &&
      ocrValue === "GPU"
    ) {
      await libUtil.renameLib("ppocr.dll", "g_ppocr.dll");
      await libUtil.renameLib("paddle_inference.dll", "g_paddle_inference.dll");
    } else {
      console.warn(
        "isFullVersionInstallBaseVersion",
        isFullVersionInstallBaseVersion,
        dep.label
      );
    }
    result = await fsUtils.decompress(dep.path, targetPath, delOriginFile);
  } else {
    result = await fsUtils.copy(dep.path, installPath, delOriginFile, true);
  }
  return result;
};
const syncDepPkgList = async () => {
  if (!lastDepPkg) {
    await checkLibs();
  }
  const { depPkgList } = useDepInfo();
  if (lastDepPkg) {
    depPkgList.value = lastDepPkg;
  }
};

export const getDepStateType = (state: string) => {
  switch (state) {
    case "完整版":
      return "primary";
    case "不可用":
      return "danger";
    case "精简版":
      return "warning";
    default:
      return "info";
  }
};

export const libUtil = {
  libExists,
  renameLib,
  syncOcrValue,
  syncDependentVersion,
  checkDepUpdate,
  checkDepLack,
  getAllLibsName,
  installDep,
  diffLocalVersionConfig,
  getDepStateType,
  pushUpdateDep,
  batchUpdateDep
};
