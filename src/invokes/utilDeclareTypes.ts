export const UTIL_DECLARE_STRING = `
  declare type RendererList = {
    groupLabel: string;
    enable: boolean;
    checkList: {
      label: string;
      checked: boolean;
    }[];
    inputList: {
      label: string;
      value: string;
    }[];
    selectList: {
      label: string;
      options: string[];
      value: string;
    }[];
    groupSelectList: {
      label: string;
      options: {
        groupLabel: string;
        options: {
          value: string;
          label: string;
        }[];
      }[];
      value: string;
    }[];
    multipleGroupSelectList: {
      label: string;
      options: {
        groupLabel: string;
        options: {
          value: string;
          label: string;
        }[];
      }[];
      limit?: number;
      value: string[];
    }[];
    tableList: {
      label: string;
      tableData: object[];
      tableHeader: TableFormHeader[];
      inputProp: {
        propLabel: string;
        type: "select" | "input" | "input-number";
        value: string | number;
        options: string[];
      }[];
    }[];
  };




  declare class FormUtil {
    constructor(form: RendererList[]);
    /**
     * 获取表单字段的值。
     *
     * @template T 字段值的类型，默认为 number | string | string[] | boolean | object[]。
     *
     * @param {("checkList" | "groupSelectList" | "inputList" | "multipleGroupSelectList" | "selectList" | "tableList")} valueType 字段类型。
     * @param {string} label 字段标签。
     * @param {T} failValue 当字段不存在或组不启用时返回的失败值。
     * @param {string} [groupLabel="*脚本设置"] 组标签，默认为 "*脚本设置"。
     *
     * @returns 字段的值，如果字段不存在或组不启用，则返回 failValue。
     */
    public getFieldValue<T = number | string | string[] | boolean | object[]>(
      valueType:
        | "checkList"
        | "groupSelectList"
        | "inputList"
        | "multipleGroupSelectList"
        | "selectList"
        | "tableList",
      label: string,
      failValue: T,
      groupLabel?: string
    ): T;
  }
  declare const WORK_DIR: string;
  declare const SCREEN_SHOT_PATH: string;
  declare const SCREEN_SHOT_DIR: string;
  declare const __httpValue: string;
  declare const SCRIPT_ROOT_DIR: string;
  declare const isStop: boolean;
  declare const SCRIPT_ID: string;
  declare function buildForm(
    buildFormList: (
      | {
          targetGroupLabel: string;
          type:
            | "input"
            | "multiplSelection"
            | "groupSelect"
            | "select"
            | "check"
            | "table";
          label: string;
          options: {
            groupLabel: string;
            options: {
              value: string;
              label: string;
            }[];
          }[];
          limit?: number;
          value: string[];
          enable?: boolean;
        }
      | {
          targetGroupLabel: string;
          type:
            | "input"
            | "multiplSelection"
            | "groupSelect"
            | "select"
            | "check"
            | "table";
          label: string;
          options: {
            groupLabel: string;
            options: {
              value: string;
              label: string;
            }[];
          }[];
          value: string;
          enable?: boolean;
        }
      | {
          targetGroupLabel: string;
          type:
            | "input"
            | "multiplSelection"
            | "groupSelect"
            | "select"
            | "check"
            | "table";
          label: string;
          options: string[];
          value: string;
          enable?: boolean;
        }
      | {
          targetGroupLabel: string;
          type:
            | "input"
            | "multiplSelection"
            | "groupSelect"
            | "select"
            | "check"
            | "table";
          label: string;
          tableData: object[];
          tableHeader: TableFormHeader[];
          inputProp: {
            propLabel: string;
            type: "select" | "input" | "input-number";
            value: string | number;
            options: string[];
          }[];
          enable?: boolean;
        }
      | {
          targetGroupLabel: string;
          type:
            | "input"
            | "multiplSelection"
            | "groupSelect"
            | "select"
            | "check"
            | "table";
          label: string;
          checked: boolean;
          enable?: boolean;
        }
      | {
          targetGroupLabel: string;
          type:
            | "input"
            | "multiplSelection"
            | "groupSelect"
            | "select"
            | "check"
            | "table";
          label: string;
          value: string;
          enable?: boolean;
        }
    )[]
  ): void;
  declare function setAllTask(num: number): void;
  declare function setCurTask(num: number): void;
  declare function getAllTask(): number;
  declare function getCurTask(): number;
  declare function getCurTaskName(): string;
  declare function nextTask(name: string): void;
  declare function getTaskStatus():("" | "success" | "warning" | "exception");
  declare function setTaskEndStatus(status: "success" | "warning" | "exception" | "", endMessage?: string): void;
  declare function buildTableForm(): TableForm;
  /**
   * 获取自定义表单
   * @returns {Promise<FormUtil>}
  */
  declare function getCustomizeForm(): Promise<FormUtil>;
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
  declare function pushElementToCheckList(elem: {
    targetGroupLabel: string;
    label: string;
    checked: boolean;
    enable?: boolean | undefined;
  }): void;
  declare function pushElementToInputList(elem: {
    targetGroupLabel: string;
    label: string;
    value: string;
    enable?: boolean | undefined;
  }): void;
  declare function pushElementToSelectList(elem: {
    targetGroupLabel: string;
    label: string;
    options: string[];
    value: string;
    enable?: boolean | undefined;
  }): void;
  declare function pushElementToGSList(elem: {
    targetGroupLabel: string;
    label: string;
    options: {
      groupLabel: string;
      options: {
        value: string;
        label: string;
      }[];
    }[];
    value: string;
    enable?: boolean | undefined;
  }): void;
  declare function pushElementToMGSList(elem: {
    targetGroupLabel: string;
    label: string;
    options: {
      groupLabel: string;
      options: {
        value: string;
        label: string;
      }[];
    }[];
    limit?: number | undefined;
    value: string[];
    enable?: boolean | undefined;
  }): void;
  declare function pushElementToTableList(elem: {
    targetGroupLabel: string;
    label: string;
    tableData: object[];
    tableHeader: TableFormHeader[];
    inputProp: {
      propLabel: string;
      type: "select" | "input" | "input-number";
      value: string | number;
      options: string[];
    }[];
    enable?: boolean | undefined;
  }): void;
`;
//@ts-ignore
const RETAIN_STRING = `
declare type TableFormHeader = {
  prop: string;
  label: string;
  width?: number;
}
declare class TableForm {
  private tableHeader: TableFormHeader[];
  private inputProp: {
    propLabel: string;
    type: "select" | "input" | "input-number";
    value: string | number;
    options: string[];
  }[];
  constructor();
  get getTableHeader(): TableFormHeader[];
  get getInputProp(): {
    propLabel: string;
    type: "select" | "input" | "input-number";
    value: string | number;
    options: string[];
  }[];
  set setTableHeader(tableHeader: TableFormHeader[]);
  pushTableHeaderProp(
    h: TableFormHeader,
    type: "select" | "input" | "input-number",
    value: string | number,
    options?: string[]
  ): void;
}
`
