type GlobalShortcutsStore = {
  allShortcuts: {
    shortcuts: string;
    onlyDescription: string;
  }[];
};
type GlobalShortcutsStoreActions = {
  updateShortcuts(onlyDescription: string, newShortcuts: string): void;
  getShortcuts(onlyDescription: string): string;
  exportData(): string;
  importData(cacheData: string): void;
  init(): void;
};
type ListStoreActions = {
  exportData(): Promise<string>;
  importData(data: string): Promise<void>;
  init(): Promise<void>;
};
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
type RendererFieldTypes =
  | "input"
  | "select"
  | "select-group"
  | "multiple-select-group"
  | "check"
  | "switch";

type GroupSelectOption = {
  groupLabel: string;
  options: {
    value: string;
    label: string;
  }[];
}[];
type SelectOptionTypes = GroupSelectOption | string[];
type SelectLimitType = number | undefined;
type SelectFieldValueType<
  T extends SelectOptionTypes,
  K extends SelectLimitType = undefined
> = {
  options: T;
  value: string;
  limit: K;
};

type FieldValueType<
  T extends SelectOptionTypes,
  K extends SelectLimitType = undefined
> = string | boolean | SelectFieldValueType<T, K>;
type FormRendererField<
  T extends SelectOptionTypes,
  K extends SelectLimitType = undefined,
  P extends FieldValueType<T, K>
> = {
  id: string;
  label: string;
  type: RendererFieldTypes;
  value: P;
};
type RendererGroups = {
  groupLabel?: string;
  enable: boolean;
  field: FormRendererField;
}[];

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
type CodeSnippet = {
  id: string;
  name: string;
  filePath: string;
  description: string;
  prefix: string;
};
type ListState = {
  scriptList: ScriptItemType[];
  projectList: ProjectItemType[];
  rendererList: RendererList[];
  previewRendererList: RendererList[];
  previewBuildFormList: BuildFormList;
  deviceList: string[];
  codeSnippets: CodeSnippet[];
};
