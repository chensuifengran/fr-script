export const getCommanDeclareTypes = (constantSlot: string) => `
declare class RFormUtil {
  constructor(form: RenderGroup[]);
  /**
   * 获取表单字段的值。
   *
   * @template T 字段值的类型，默认为 number | string | string[] | boolean | object[]
   *
   * @param {FieldType} fieldType 字段类型。
   * @param {string} label 字段标签。
   * @param {T} failValue 当字段不存在或组不启用时返回的失败值。
   * @param {string} [groupLabel="*脚本设置"] 组标签，默认为 "*脚本设置"。
   *
   * @returns 字段的值，如果字段不存在或组不启用，则返回 failValue。
   */
  public getFieldValue<T = string | number | boolean | string[] | object[]>(
    fieldType: FieldType, 
    label: string, 
    failValue: T, 
    groupLabel?: string
  ): T;
  /**
   * 通过 id 获取表单字段的值。
   *
   * @template T 字段值的类型，默认为 number | string | string[] | boolean | object[]
   *
   * @param {string} id 字段 id。
   * @param {T} failValue 当字段不存在或组不启用时返回的失败值。
   *
   * @returns 字段的值，如果字段不存在或组不启用，则返回 failValue。
   */
  public getFieldValueById<T = number | string | string[] | boolean | object[]>(
    id: string,
    failValue: T
  ): T;
  /**
   * 获取指定组的所有表单项的值
   * 
   * @template T 默认为 Record<string, any>
   * 
   * @param groupLabel 分组的label
   * 
   * @returns 表单项的值
   */
  public getGroupValues<T = Record<string, any>>(groupLabel: string): T;
}
${constantSlot}
declare const isStop: boolean;
declare const SCRIPT_ID: string;

declare function setAllTask(num: number): void;
declare function setCurTask(num: number): void;
declare function getAllTask(): number;
declare function getCurTask(): number;
declare function getCurTaskName(): string;
declare function nextTask(name: string): void;
declare function getTaskStatus():("" | "success" | "warning" | "exception");
declare function setTaskEndStatus(status: "success" | "warning" | "exception" | "", endMessage?: string): void;
/**
 * 获取自定义表单
 * @returns {Promise<RFormUtil>}
*/
declare function getCustomizeForm(): Promise<RFormUtil>;
declare const abortSignalInScript: AbortController;
declare const startScriptSignal: AbortController;
declare function removeIntervals(): void;
declare const renderList: RenderGroup[];
declare function getScriptId(): string;
declare function changeScriptRunState(state: boolean | "stop", taskId?: string) : void;

/**
 * 复制文本到剪贴板。
 * @param {string} text 要复制的文本。
*/
declare function copyText(text: string): Promise<void>;

/**
 * 从剪贴板读取文本。
 * @returns {Promise<string>}
*/
declare function readClipboardFirstText(): Promise<string>;

declare function clearLogOutput() : {
  time: string;
  log: string;
  type: "success" | "danger" | "info" | "warning";
}[];
declare function replaceRenderList(newRenderList: RenderGroup[]) : void;

declare function pushElement(elem: BuildFormItems): void;
`;
