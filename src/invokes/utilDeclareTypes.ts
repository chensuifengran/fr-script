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
  /**
   * 等待一段时间。
   *
   * @param {number} ms 要暂停的时间，单位为毫秒, 默认值为1000。
   * 
   * @example await sleep();
   * 
   * @returns Promise<void>
   *
   */
  declare function sleep(ms?: number):Promise<void>;
  declare const abortSignalInScript: AbortController;
  declare const startScriptSignal: AbortController;
  declare function removeIntervals(): void;
  declare const rendererList: RendererList[];
  declare function getScriptId(): string;
  declare function changeScriptRunState(state: boolean | "stop", taskId?: string) : void;
  /**
   * 显示一条消息在运行窗口/通知窗口。
   *
   * @param {string} msg 要显示的消息。
   * @param {("success" | "danger" | "info" | "warning" | "loading")} [type] 消息的类型，默认为 "info"。
   * @returns void
   */
  declare function log(msg: string, type?: "success" | "danger" | "info" | "warning" | "loading"): void;
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
export const INPUT_KEY_TYPE = `
declare type Key =
  // 数字键
  | "Num0"
  | "Num1"
  | "Num2"
  | "Num3"
  | "Num4"
  | "Num5"
  | "Num6"
  | "Num7"
  | "Num8"
  | "Num9"
  // 字母键
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z"
  // 功能键
  | "F1" // F1键
  | "F2" // F2键
  | "F3" // F3键
  | "F4" // F4键
  | "F5" // F5键
  | "F6" // F6键
  | "F7" // F7键
  | "F8" // F8键
  | "F9" // F9键
  | "F10" // F10键
  | "F11" // F11键
  | "F12" // F12键
  // 控制键
  | "Backspace" // 退格键
  | "Tab" // 制表键
  | "Enter" // 回车键
  | "Shift" // Shift键
  | "Control" // Ctrl键
  | "Alt" // Alt键
  | "Pause" // Pause键
  | "CapsLock" // 大写锁定键
  | "Escape" // Esc键
  | "Space" // 空格键
  | "PageUp" // Page Up键
  | "PageDown" // Page Down键
  | "End" // End键
  | "Home" // Home键
  | "LeftArrow" // 左箭头键
  | "UpArrow" // 上箭头键
  | "RightArrow" // 右箭头键
  | "DownArrow" // 下箭头键
  | "Insert" // Insert键
  | "Delete" // Delete键
  // 其他键
  | "Windows" // Windows键
  | "ContextMenu" // 右键菜单键
  | "NumLock" // 数字锁定键
  | "ScrollLock" // 滚动锁定键
  | "Semicolon" // 分号键
  | "Equal" // 等号键
  | "OEMComma" // 逗号键
  | "Dash" // 破折号键
  | "Period" // 句号键
  | "Slash" // 斜杠键
  | "Backquote" // 反引号键
  | "BracketLeft" // 左方括号键
  | "Backslash" // 反斜杠键
  | "BracketRight" // 右方括号键
  | "Quote" // 引号键
  ;
`;
