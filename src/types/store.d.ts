declare type GlobalShortcutsStore = {
  allShortcuts: {
    shortcuts: string;
    onlyDescription: string;
  }[];
};
declare type GlobalShortcutsStoreActions = {
  updateShortcuts(onlyDescription: string, newShortcuts: string): void;
  getShortcuts(onlyDescription: string): string;
  exportData(): string;
  importData(cacheData: string): void;
  init(): void;
};
declare type ListStoreActions = {
  exportData(): Promise<string>;
  importData(data: string): Promise<void>;
  init(): Promise<void>;
};
declare type GlobalSettings = {
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
    _screenshotDir: string;
    _scriptRootDir: string;
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
declare type ScriptSettingType = {
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
declare type ScriptItemType = {
  id: string;
  name: string;
  savePath: string;
  version: string;
  description: string;
  setting: ScriptSettingType;
};
declare type ProjectItemType = {
  id: string;
  name: string;
  savePath: string;
  version: string;
  description: string;
};

declare type CodeSnippet = {
  id: string;
  name: string;
  filePath: string;
  description: string;
  prefix: string;
};
declare type ListState = {
  scriptList: ScriptItemType[];
  projectList: ProjectItemType[];
  rendererList: RenderGroup[];
  deviceList: string[];
  codeSnippets: CodeSnippet[];
};
