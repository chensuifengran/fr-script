import { getVersion } from "@tauri-apps/api/app";
import { exists, renameFile } from "@tauri-apps/api/fs";
import {
  CheckDepItemType,
  DependenceItemType,
  NeedUpdateDepType,
  VersionItemType,
} from "../types/lib";
import { storeToRefs } from "pinia";

const renameLib = async (name: string, targetName: string) => {
  try {
    const installPath = await pathUtils.getInstallDir();
    const libPath = await pathUtils.join(installPath, name);
    const targetPath = await pathUtils.join(installPath, targetName);
    await renameFile(libPath, targetPath);
    // console.log("renameFile", libPath, targetPath);
  } catch (error) {
    console.error("库文件重命名失败：", error);
  }
};

const diffLocalVersionConfig = async (checkList: CheckDepItemType[]) => {
  const localValue = localStorage.getItem("localDependentVersion");
  if (localValue) {
    const localInfos: VersionItemType[] = JSON.parse(localValue);
    const resultList: NeedUpdateDepType[] = [];
    for (const localInfo of localInfos) {
      const checkItem = checkList.find((i) => i.name === localInfo.name);
      if (checkItem) {
        if (localInfo.version !== checkItem.version) {
          resultList.push({
            name: checkItem.name,
            version: checkItem.version,
            download_url: checkItem.downloadUrl,
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
                });
              }
            }
          }
        }
      }
    }
    return resultList;
  } else {
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
    return [];
  }
};

const syncDependentVersion = async (checkList?: CheckDepItemType[]) => {
  if (!checkList) {
    checkList = await checkLibs();
  }
  const needUpdateInfo = await diffLocalVersionConfig(checkList);
  if (needUpdateInfo.length > 0) {
    const appGSStore = useAppGlobalSettings();
    const { app } = storeToRefs(appGSStore);
    app.value.depHaveUpdate = true;
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
const checkDepList = async (depList: DependenceItemType[]) => {
  const resultList: CheckDepItemType[] = [];
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
      });
    } else {
      resultList.push({
        name: dep.name,
        exists: await libExists(dep.name),
        downloadUrl: dep.download_url,
        children: [],
        version: dep.version,
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
  /*
libInfo:[
    {
        "suitable_app_version": [
            "0.0.3",
            "0.0.4"
        ],
        "dependence": [
            {
                "name": "screenOperation.dll",
                "version": "S1",
                "desc": "APP基础依赖",
                "download_url": [
                    {
                        "origin": "阿里云盘",
                        "url": "https://www.alipan.com/s/seYTGq5aYWr",
                        "pwd": ""
                    },
                    {
                        "origin": "中国移动云盘",
                        "url": "https://caiyun.139.com/m/i?145CFWPITNNX1",
                        "pwd": "U02M"
                    }
                ],
                "decompression": false,
                "child_files": [],
                "dependence": [
                    {
                        "name": "opencv_world460.dll",
                        "version": "v1",
                        "desc": "screenOperation.dll的依赖文件",
                        "download_url": [
                            {
                                "origin": "阿里云盘",
                                "url": "https://www.alipan.com/s/QC5Pu3eF1WH",
                                "pwd": ""
                            },
                            {
                                "origin": "中国移动云盘",
                                "url": "https://caiyun.139.com/m/i?145CGAMPtPNdB",
                                "pwd": "1ZMO"
                            }
                        ],
                        "decompression": false,
                        "child_files": [],
                        "dependence": []
                    }
                ]
            },
            {
                "name": "ppocr.dll",
                "version": "PC1",
                "desc": "OCR识别 CPU识别版本",
                "download_url": [
                    {
                        "origin": "阿里云盘",
                        "url": "https://www.alipan.com/s/1y3bD1JWo1c",
                        "pwd": ""
                    },
                    {
                        "origin": "中国移动云盘",
                        "url": "https://caiyun.139.com/m/i?145CFqNGqjjDw",
                        "pwd": "qGta"
                    }
                ],
                "decompression": false,
                "child_files": [],
                "dependence": [
                    {
                        "name": "ppocr_models_v4.7z",
                        "version": "v1",
                        "desc": "OCR识别所需的模型文件",
                        "download_url": [
                            {
                                "origin": "中国移动云盘",
                                "url": "https://caiyun.139.com/m/i?145CFCEJjas6E",
                                "pwd": "SFV5"
                            }
                        ],
                        "decompression": true,
                        "child_files": [
                            "layout_publaynet_dict.txt",
                            "ppocr_keys_v1.txt",
                            "table_structure_dict_ch.txt",
                            "v4_rec_infer/inference.pdiparams",
                            "v4_rec_infer/inference.pdmodel",
                            "v4_rec_infer/inference.pdiparams.info",
                            "v4_det_infer/inference.pdiparams",
                            "v4_det_infer/inference.pdmodel",
                            "v4_det_infer/inference.pdiparams.info"
                        ],
                        "rootPath": "ppocr_models_v4",
                        "dependence": []
                    },
                    {
                        "name": "ocr_base_extend_v1.7z",
                        "version": "v1",
                        "desc": "OCR识别所需的依赖文件",
                        "download_url": [
                            {
                                "origin": "中国移动云盘",
                                "url": "https://caiyun.139.com/m/i?145C7mngsVsyW",
                                "pwd": "pHKD"
                            }
                        ],
                        "decompression": true,
                        "child_files": [
                            "gdi32.dll",
                            "init.png",
                            "libiomp5md.dll",
                            "mkldnn.dll",
                            "mklml.dll",
                            "onnxruntime.dll",
                            "paddle_inference.dll",
                            "paddle2onnx.dll"
                        ],
                        "dependence": []
                    }
                ]
            },
            {
                "name": "g_ppocr.dll",
                "version": "PG1",
                "desc": "OCR识别 GPU识别版本",
                "download_url": [
                    {
                        "origin": "阿里云盘",
                        "url": "https://www.alipan.com/s/BeeNnAZhPNB",
                        "pwd": ""
                    },
                    {
                        "origin": "中国移动云盘",
                        "url": "https://caiyun.139.com/m/i?145CFCEHOGFP3",
                        "pwd": "ucm0"
                    }
                ],
                "decompression": false,
                "child_files": [],
                "dependence": [
                    {
                        "name": "ocr_gpu_extend.7z",
                        "version": "v1",
                        "desc": "OCR识别所需的依赖文件",
                        "download_url": [
                            {
                                "origin": "中国移动云盘",
                                "url": "https://caiyun.139.com/m/i?145CGAMNY4koV",
                                "pwd": "zwfk"
                            }
                        ],
                        "decompression": true,
                        "child_files": [
                            "g_paddle_inference.dll",
                            "nvinfer.dll",
                            "nvinfer_plugin.dll",
                            "nvonnxparser.dll",
                            "nvparsers.dll"
                        ],
                        "dependence": []
                    },
                    {
                        "name": "ocr_base_extend_v1.7z",
                        "version": "v1",
                        "desc": "OCR识别所需的依赖文件",
                        "download_url": [
                            {
                                "origin": "中国移动云盘",
                                "url": "https://caiyun.139.com/m/i?145C7mngsVsyW",
                                "pwd": "pHKD"
                            }
                        ],
                        "decompression": true,
                        "child_files": [
                            "gdi32.dll",
                            "init.png",
                            "libiomp5md.dll",
                            "mkldnn.dll",
                            "mklml.dll",
                            "onnxruntime.dll",
                            "paddle_inference.dll",
                            "paddle2onnx.dll"
                        ],
                        "dependence": []
                    }
                ]
            }
        ],
        "full_dependence": {
            "name": "full_extend_v1.7z",
            "version": "v1",
            "desc": "APP完整功能依赖",
            "download_url": [
                {
                    "origin": "中国移动云盘",
                    "url": "https://caiyun.139.com/m/i?145CGAMLCk8CF",
                    "pwd": "Rtx9"
                }
            ],
            "decompression": true,
            "child_files": [
                "gdi32.dll",
                "init.png",
                "libiomp5md.dll",
                "mkldnn.dll",
                "mklml.dll",
                "onnxruntime.dll",
                "paddle_inference.dll",
                "paddle2onnx.dll",
                "g_paddle_inference.dll",
                "nvinfer.dll",
                "nvinfer_plugin.dll",
                "nvonnxparser.dll",
                "nvparsers.dll",
                "opencv_world460.dll",
                "g_ppocr.dll",
                "ppocr.dll",
                "screenOperation.dll",
                "layout_publaynet_dict.txt",
                "ppocr_keys_v1.txt",
                "table_structure_dict_ch.txt",
                "v4_rec_infer/inference.pdiparams",
                "v4_rec_infer/inference.pdmodel",
                "v4_rec_infer/inference.pdiparams.info",
                "v4_det_infer/inference.pdiparams",
                "v4_det_infer/inference.pdmodel",
                "v4_det_infer/inference.pdiparams.info"
            ]
        }
    }
]
  */

  const currentVersion = await getVersion();
  //找到适合当前版本的依赖
  const suitableDep = libInfo.find((i: any) => {
    return i.suitable_app_version.includes(currentVersion);
  });
  if (suitableDep) {
    const checkList: CheckDepItemType[] = [];
    for (const dep of suitableDep.dependence) {
      checkList.push({
        exists: await libExists(dep.name),
        downloadUrl: dep.download_url,
        name: dep.name,
        children: await checkDepList(dep.dependence),
        version: dep.version,
      });
    }
    console.log("checkObject", checkList);

    return checkList;
  }
  return [];
};

const getDepState = async (list: CheckDepItemType[], depName: string) => {
  const dep = list.find((i) => i.name === depName);
  if (dep) {
    if (!dep.exists) {
      if (dep.name === "g_ppocr.dll") {
        const ppocrExists = await libExists("ppocr.dll");
        const c_ppocrExists = await libExists("c_ppocr.dll");
        return !!ppocrExists && !!c_ppocrExists;
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
  const stateDepList = ["screenOperation.dll", "ppocr.dll", "g_ppocr.dll"];
  const resultList: boolean[] = [];

  for (const dep of stateDepList) {
    resultList.push(await getDepState(checkList, dep));
  }
  let version: "完整版" | "基础版" | "精简版" | "不可用" = "不可用";
  if (resultList[0] && resultList[1] && resultList[2]) {
    version = "完整版";
  } else if (resultList[0] && resultList[1]) {
    version = "基础版";
  } else if (resultList[0]) {
    version = "精简版";
  }
  const appGSStore = useAppGlobalSettings();
  const { app } = storeToRefs(appGSStore);
  app.value.dependenceState = version;
};

const checkDepUpdate = async () => {
  const checkList = await checkLibs();
  //同步依赖状态
  await syncDepState(checkList);
  //同步依赖最新版本
  const needUpdateInfo =  await syncDependentVersion(checkList);
  console.log("needUpdateInfo",needUpdateInfo);
  
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
  const baseDep = checkList.find((i) => i.name === "ppocr.dll");
  const fullDep = checkList.find((i) => i.name === "g_ppocr.dll");
  if (state === "不可用") {
    if (simpleDep && baseDep && fullDep) {
      if (!simpleDep.exists) {
        simpleStateLackDeps.push({
          name: simpleDep.name,
          version: simpleDep.version,
          download_url: simpleDep.downloadUrl,
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

export const libUtil = {
  libExists,
  renameLib,
  syncOcrValue,
  syncDependentVersion,
  checkDepUpdate,
  checkDepLack,
};
