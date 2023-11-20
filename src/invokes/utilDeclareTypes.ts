export const UTIL_DECLARE_STRING = `
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
  declare type OCRObject = {
    code: number;
    result: OCRResult[];
  }
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
  declare function getCustomizeForm(): Promise<RendererList[]>;

  declare function changeScriptRunState(state: boolean | "stop", taskId?: string) : void;
  declare function clearLogOutput() : {
    time: string;
    log: string;
    type: "success" | "danger" | "info" | "warning";
  }[];
  declare function pushLogProxy(
    log: string,
    type?: "success" | "danger" | "info" | "warning"
  ) : void;
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
  declare function waitGlobalKeyInput(key:string, stopKey:string): Promise<boolean>;
`;
