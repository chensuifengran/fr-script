type GlobalSettings = {
  app: {
    dependentSerial: string[];
    editorTheme: {
      value: "跟随全局主题" | "明亮" | "暗黑";
      options: ["跟随全局主题", "明亮", "暗黑"];
    };
    state: {
      aside: {
        collapsed: boolean;
        currentItem: string;
      };
    };
    modulesSetting: {
      autoOpenOutput: boolean;
      drawerSize: string;
    };
  };
  envSetting: {
    workDir: string;
    screenshotSavePath: string;
    tempDrivePath: {
      value: string;
      options: string[];
    };
  };
  ocr: {
    value: "GPU" | "CPU";
    options: ["GPU", "CPU"];
    gpuMemory: number;
    inited: boolean;
  };
};
type Runtime = {
  notAllowedFnId: string[];
  currentScriptDir: string;
  runningFnId: string;
};
type ScriptSettingType = {
  //自动导入上次运行配置
  autoImportLastRunConfig: boolean;
  //目标ADB设备
  targetAdbDevice: string;
  //主动排除的ADB设备
  excludeDevice: string[];
  //启动目标
  targetApp: string;
  //启动目标的控制选项
  autoStartTargetApp: boolean;
};
type ScriptItemType = {
  id: string;
  name: string;
  savePath: string;
  version: string;
  description: string;
  setting: ScriptSettingType;
};
type ProjectItemType = {
  id: string;
  name: string;
  savePath: string;
  version: string;
  description: string;
};
type TableFormHeader = {
  prop: string;
  label: string;
  width?: number;
};
type RendererList = {
  id?: string;
  groupLabel: string;
  enable: boolean;
  checkList: { label: string; checked: boolean }[];
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

type BuildFormItem =
  | {
      targetGroupLabel: string;
      type:
        | "multiplSelection"
        | "groupSelect"
        | "select"
        | "check"
        | "table"
        | "input";
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
        | "multiplSelection"
        | "groupSelect"
        | "select"
        | "check"
        | "table"
        | "input";
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
        | "multiplSelection"
        | "groupSelect"
        | "select"
        | "check"
        | "table"
        | "input";
      label: string;
      options: string[];
      value: string;
      enable?: boolean;
    }
  | {
      targetGroupLabel: string;
      type:
        | "multiplSelection"
        | "groupSelect"
        | "select"
        | "check"
        | "table"
        | "input";
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
        | "multiplSelection"
        | "groupSelect"
        | "select"
        | "check"
        | "table"
        | "input";
      label: string;
      checked: boolean;
      enable?: boolean;
    }
  | {
      targetGroupLabel: string;
      type:
        | "multiplSelection"
        | "groupSelect"
        | "select"
        | "check"
        | "table"
        | "input";
      label: string;
      value: string;
      enable?: boolean;
    };
type BuildFormList = BuildFormItem[];

type ListState = {
  scriptList: ScriptItemType[];
  projectList: ProjectItemType[];
  rendererList: RendererList[];
  previewRendererList: RendererList[];
  previewBuildFormList: BuildFormList;
};
