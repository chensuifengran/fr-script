import type { AppGSStore } from "../store/globalSettings";
let typeConstant = "";
let lastConstants: Record<string, string> = {};
/**
 * 注入常量到脚本运行上下文，自动完成常量的注入和编辑器类型声明的提供
 * 如要新增常量，需要在此方法中的constants对象中添加对应的常量
 * settingStore为常量的来源，可根据实际情况增加和修改参数
 * (此方法在useScriptApi的getWillRunScript方法中调用)
 * @param settingStore 用来获取全局设置的store
 * @returns 常量的注入字符串
 */
export const genInjectConstant = (settingStore?: AppGSStore) => {
  typeConstant = "";
  const WORK_DIR =
    settingStore?.envSetting.workDir?.replaceAll("\\", "\\\\") || "";
  const SCREEN_SHOT_DIR =
    settingStore?.envSetting._screenshotDir?.replaceAll("\\", "\\\\") || "";
  const SCREEN_SHOT_PATH =
    settingStore?.envSetting.screenshotSavePath?.replaceAll("\\", "\\\\") || "";
  const SCRIPT_ROOT_DIR =
    settingStore?.envSetting._scriptRootDir?.replaceAll("\\", "\\\\") || "";
  const constants = {
    WORK_DIR,
    SCREEN_SHOT_DIR,
    SCREEN_SHOT_PATH,
    SCRIPT_ROOT_DIR,
  } as const;
  lastConstants = constants;
  const keys = Object.keys(constants) as (keyof typeof constants)[];
  return keys
    .map((key) => {
      typeConstant += `declare const ${key}: string;\n`;
      return `const ${key} = "${constants[key]}";`;
    })
    .join("\n");
};
/**
 * 此方法用于初始化常量注入的类型声明，需要在编辑器首次初始化之前调用
 * @returns 返回值无意义
 */
export const initInjectConstantType = () => genInjectConstant();
/**
 *  编辑器首次初始化时调用editorTsDeclaration方法
 *  editorTsDeclaration方法会调用此方法获取常量注入的类型声明
 * @returns 常量的类型声明字符串
 */
export const getInjectConstantType = () => typeConstant;

export const getLastConstants = () => {
  const appGSStore = useAppGlobalSettings();
  genInjectConstant(appGSStore);
  return lastConstants;
};
