type GlobalSettings = {
  isInited: boolean;
  app: {
    //最新版本
    latestVersion: string;
    depHaveUpdate: boolean;
    dependenceState: "不可用" | "精简版" | "基础版" | "完整版";
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
  };
  ocr: {
    value: "GPU" | "CPU";
    options: ["GPU", "CPU"];
    gpuMemory: number;
  };
  view: {
    showUpdateInTitleBar: boolean;
  };
  editor: {
    theme: {
      value: "跟随全局主题" | "明亮" | "暗黑";
      options: ["跟随全局主题", "明亮", "暗黑"];
    };
    runAutoSave: boolean;
  };
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
type InputListItem = {
  label: string;
  value: string;
};
type SelectListItem = {
  label: string;
  options: string[];
  value: string;
};
type groupSelectListItem = {
  label: string;
  options: {
    groupLabel: string;
    options: {
      value: string;
      label: string;
    }[];
  }[];
  value: string;
};
type MultiplSelectionItem = {
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
};
type TableListItem = {
  label: string;
  tableData: object[];
  tableHeader: TableFormHeader[];
  inputProp: {
    propLabel: string;
    type: "select" | "input" | "input-number";
    value: string | number;
    options: string[];
  }[];
};
type CheckListItem = { label: string; checked: boolean };
type RendererList = {
  id?: string;
  groupLabel: string;
  enable: boolean;
  checkList: CheckListItem[];
  inputList: InputListItem[];
  selectList: SelectListItem[];
  groupSelectList: groupSelectListItem[];
  multipleGroupSelectList: MultiplSelectionItem[];
  tableList: TableListItem[];
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
  deviceList: string[];
};
