export const UTIL_DECLARE_STRING = `
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
  declare class MatchUtil {
    x:number;
    y:number;
    constructor(x: number, y: number);
    public click(): Promise<void>;
    public touch(): Promise<string>;
  }
  declare class FindResult {
    centerPos: [number, number];
    text: string;
    score: number;
    constructor(
      position: OCRResult["position"],
      text: string,
      score: number,
      offset?: [number, number]
    );
    public click(): Promise<void>;
    public touch(): Promise<string>;
  }

  declare class OcrUtil {
    result: OCRResult[];
    private reCall: () => Promise<OcrUtil | undefined>;
    private ori: {
      x: number;
      y: number;
    };
    constructor(originX: number, originY: number, result: OCRResult[], reCall:() => Promise<OcrUtil | undefined>);
    public includes(texts: string[]): boolean;
    public findText(text: string, offset?: [number, number]): FindResult | null;
    public waitText(text: string,adb?: boolean, sleepMs?: number, maxWaitCount?: number): Promise<boolean>;
  }
  declare type OCRResult = {
    position: [
        [number, number],
        [number, number],
        [number, number],
        [number, number]
    ];
    text: string;
    score: number;
  }
  /**
    * 显示一条消息在运行窗口/通知窗口。
    *
    * @param {string} msg 要显示的消息。
    * @param {("success" | "danger" | "info" | "warning" | "loading")} [type] 消息的类型，默认为 "info"。
    * @returns void
    */
  declare function log(msg: string, type?: "success" | "danger" | "info" | "warning" | "loading") => void;
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
  
  
  
  
  
  
  
  
  
  
  
  
  declare interface TableFormHeader {
    prop: string;
    label: string;
    width?: number;
  }
  declare interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
  }
  declare class RectUtil {
    static runId: string;
    private rect: Rect;
    constructor(rect: Rect);
    public getRect(): Rect;
    public getCenter(): { x: number; y: number };
    public getCenterArr(): [number, number];
    public click(type?: "adb" | "pc"): Promise<void>;
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
  declare interface RendererList {
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
  }
  declare const abortSignalInScript: AbortController;
  declare const startScriptSignal: AbortController;
  declare const WORK_DIR: string;
  declare const SCREEN_SHOT_PATH: string;
  declare const SCREEN_SHOT_DIR: string;
  declare const SCRIPT_ROOT_DIR: string;
  declare const SCRIPT_ID: string;
  declare const __httpValue: string;
  declare const isStop: boolean;
  declare const devicesMapping: {
    device: string;
    name: string;
    startTarget: string;
  }[];
  declare function filePathIsExits(path: string): Promise<boolean>;
  declare function buildTableForm(): TableForm;
  declare function setAllTask(num: number): void;
  declare function setCurTask(num: number): void;
  declare function nextTask(name: string): void;
  declare function getAllTask(): number;
  declare function getCurTask(): number;
  declare function getCurTaskName(): string;
  
  declare function pushElementToSelectList(elem: {
    targetGroupLabel: string;
    label: string;
    options: string[];
    value: string;
    enable?: boolean | undefined;
  }): void;
  
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
  
  declare function fileDownload(
    fileUrl: string,
    savePath: string,
    fileName: string
  ): Promise<string>;
  
  declare function closeProgressDialog(clear?: boolean): void;
  declare function getScriptId(): string;
  /**
   * 获取自定义表单
   * @returns {Promise<FormUtil>}
  */
  declare function getCustomizeForm(): Promise<FormUtil>;

  declare function changeScriptRunState(state: boolean | "stop", taskId?: string) : void;
  declare function clearLogOutput() : {
    time: string;
    log: string;
    type: "success" | "danger" | "info" | "warning";
  }[];

  declare function replaceRendererList(newRendererList: RendererList[]) : void;
  declare interface Window {
    api: {
      cwd: string;
      selectPath: (
        type?: "openDirectory" | "openFile" | "openJS"
      ) => Promise<string>;
      saveFile: () => Promise<string>;
      downloadFile: (
        option: {
          url: string;
          savePath: string;
          needOpen?: boolean;
        },
        messageCallback: (msg: string) => void,
        progressCallback: (p: number) => void
      ) => Promise<string>;
      changeFloatingWindow: (open?: boolean, wid?: number) => Promise<boolean>;
      changeWindowState: (
        state?: "show" | "hidden" | "showInactive",
        wid?: number
      ) => Promise<boolean>;
      changeWindowSize: (
        width: number,
        height: number,
        wid?: number
      ) => Promise<boolean>;
      createWindow: (routePath?: string) => Promise<number>;
      invokeWindowApi: (id: number, apiName: string) => Promise<any>;
      getLastCreatedWindowId: () => Promise<number>;
      invokeMainHandle: (name: string) => void;
      openApiTestWindow: (wid: number) => void;
      getWindowURL: () => Promise<string>;
      windowIsExist: (id: number) => Promise<boolean>;
      getPath: (
        type:
          | "home"
          | "appData"
          | "userData"
          | "sessionData"
          | "temp"
          | "exe"
          | "module"
          | "desktop"
          | "documents"
          | "downloads"
          | "music"
          | "pictures"
          | "videos"
          | "recent"
          | "logs"
          | "crashDumps"
      ) => Promise<string>;
      openFile: (options: {
        path: string;
        type: "showItemInFolder" | "openPath";
      }) => Promise<boolean>;
    };
    rendererList: RendererList[];
  }
`;
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
  | "Comma" // 逗号键
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
