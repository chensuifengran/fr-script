export const UTIL_DECLARE_STRING = `
  declare namespace SelectType {
    type Multiple<T> = {
      multiple: true;
      value: T[];
      limit?: number;
    };
    type GroupOption<T> = {
      group: true;
      options: {
        groupLabel: string;
        options: T[] | OptionItem<T>[];
      }[];
    };
    type ConstantOption<T> = {
      group?: false;
      options: T[] | OptionItem<T>[];
    };
    type Single<T> = {
      multiple?: false;
      value: T;
    };
    type Base<
      T extends string | number | boolean,
      Opt extends ConstantOption<T> | GroupOption<T>,
      Val extends Single<T> | Multiple<T>
    > = Opt & Val;
    type Default<T> = ConstantOption<T> & Single<T>;
  }
  declare type OptionItem<T extends string | number | boolean = string> = {
    label: string;
    value: T;
  };
  declare type IdField = {
    id?: string;
  }
  declare type InputListItem = OptionItem & IdField;
  declare type BaseSelectItem<T extends string | number | boolean> = {
    label: string;
  } & (
    | SelectType.Default<T>
    | SelectType.Base<T, SelectType.ConstantOption<T>, SelectType.Multiple<T>>
    | SelectType.Base<T, SelectType.GroupOption<T>, SelectType.Single<T>>
    | SelectType.Base<T, SelectType.GroupOption<T>, SelectType.Multiple<T>>
  ) & IdField;
  declare type SelectListItem =
    | BaseSelectItem<string>
    | BaseSelectItem<number>
    | BaseSelectItem<boolean>;
    
  declare type CheckListItem = { label: string; checked: boolean } & IdField;

  declare type RendererList = {
    groupLabel: string;
    enable: boolean;
    checkList: CheckListItem[];
    inputList: InputListItem[];
    selectList: SelectListItem[];
  };

  declare class RFormUtil {
    constructor(form: RendererList[]);
    /**
     * 获取表单字段的值。
     *
     * @template T 字段值的类型，默认为 number | string | string[] | boolean | object[]。
     *
     * @param {("checkList" | "inputList" | "selectList")} valueType 字段类型。
     * @param {string} label 字段标签。
     * @param {T} failValue 当字段不存在或组不启用时返回的失败值。
     * @param {string} [groupLabel="*脚本设置"] 组标签，默认为 "*脚本设置"。
     *
     * @returns 字段的值，如果字段不存在或组不启用，则返回 failValue。
     */
    public getFieldValue<T = number | string | string[] | boolean | object[]>(
      valueType:
        | "checkList"
        | "inputList"
        | "selectList",
      label: string,
      failValue: T,
      groupLabel?: string
    ): T;
    /**
     * 通过 id 获取表单字段的值。
     *
     * @template T 字段值的类型，默认为 number | string | string[] | boolean | object[]。
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
  }
  declare const WORK_DIR: string;
  declare const SCREEN_SHOT_PATH: string;
  declare const SCREEN_SHOT_DIR: string;
  declare const __httpValue: string;
  declare const SCRIPT_ROOT_DIR: string;
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
  declare const rendererList: RendererList[];
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
  declare function replaceRendererList(newRendererList: RendererList[]) : void;

  declare namespace BuildFormItem {
    type Base = {
      targetGroupLabel: string;
      enable?: boolean;
    };
    type StripBase<T> = {
      [P in keyof T as Exclude<P, keyof Base>]: T[P];
    };
    type Input = Base & {
      type: "input";
      label: string;
      value: string;
    };
    type Select = Base & {
      type: "select";
      label: string;
    } & SelectListItem;
    type Check = Base & {
      type: "check";
      label: string;
      checked: boolean;
    };
  }

  declare type BuildFormItems =
    | BuildFormItem.Input
    | BuildFormItem.Select
    | BuildFormItem.Check;

  declare function pushElement(elem: BuildFormItems): void;
`;
