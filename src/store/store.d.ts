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
namespace SelectType {
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
type OptionItem<T extends string | number | boolean = string> = {
  label: string;
  value: T;
};
type IdField = {
  id?: string;
};
type CommonInputItem = {
  inputType?:"common"
} & OptionItem<string> & IdField;
type RangeInputItem = {
  inputType:"range";
  label: string;
  value: [number, number];
  limit?: [number, number];
  controls?: boolean;
} & IdField;
type InputListItem = CommonInputItem | RangeInputItem;
type BaseSelectItem<T extends string | number | boolean> = {
  label: string;
} & (
  | SelectType.Default<T>
  | SelectType.Base<T, SelectType.ConstantOption<T>, SelectType.Multiple<T>>
  | SelectType.Base<T, SelectType.GroupOption<T>, SelectType.Single<T>>
  | SelectType.Base<T, SelectType.GroupOption<T>, SelectType.Multiple<T>>
) &
  IdField;
type SelectListItem =
  | BaseSelectItem<string>
  | BaseSelectItem<number>
  | BaseSelectItem<boolean>;

type CheckListItem = { label: string; checked: boolean } & IdField;

namespace BuildFormItem {
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
  } & InputListItem;
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
type BuildFormItems =
  | BuildFormItem.Input
  | BuildFormItem.Select
  | BuildFormItem.Check;
type RendererList = {
  id?: string;
  groupLabel: string;
  enable: boolean;
  checkList: CheckListItem[];
  inputList: InputListItem[];
  selectList: SelectListItem[];
};

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
  deviceList: string[];
  codeSnippets: CodeSnippet[];
};
