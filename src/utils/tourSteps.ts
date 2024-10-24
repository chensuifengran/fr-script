import type { TourStep, TourStepNames } from "../hooks/useTour";

export type TourSteps = {
  [key in TourStepNames]: TourStep[];
};

export const tourSteps: TourSteps = {
  scriptList: [
    {
      target: "#script_route",
      title: "脚本列表(介绍)",
      description: "此处是脚本列表，支持对脚本进行管理、设置、运行",
    },
    {
      target: "#search_script_input",
      title: "脚本搜索",
      description: "输入脚本名称或者备注可对显示的列表进行过滤",
    },
    {
      target: "#new_script_btn",
      title: "新建脚本(操作)",
      description: "点击此按钮新建一个演示用的脚本，新建完成后可进行下一步",
      preventNext: true,
      onShow: () => {
        const { searchInfo } = useAutoTitleBar();
        searchInfo.content = "";
      },
    },
    {
      target: "#DEMO_SCRIPT_ITEM .info",
      title: "演示脚本(介绍)",
      description: "点击中间可展看查看脚本详情，搜索栏为空时支持拖动排序",
    },
    {
      target: "#DEMO_SCRIPT_ITEM .menu",
      title: "演示脚本(介绍)",
      description: "右边的按钮依次是：删除、编辑、打开、设置、运行",
    },
    {
      target: "#DEMO_SCRIPT_ITEM-DEL",
      title: "删除脚本(介绍)",
      description: "可从脚本列表中移除脚本(不会删除本地文件)",
    },
    {
      target: "#DEMO_SCRIPT_ITEM-EDIT",
      title: "编辑脚本(介绍)",
      description: "点击进入脚本编辑器对脚本进行编辑",
    },
    {
      target: "#DEMO_SCRIPT_ITEM-OPEN",
      title: "打开脚本(介绍)",
      description:
        "可选择使用VSCode打开脚本文件或者在文件管理器中显示并选中",
    },
    {
      target: "#DEMO_SCRIPT_ITEM-SETTING",
      title: "脚本设置(介绍)",
      description: "可对脚本进行设置",
    },
    {
      target: "#DEMO_SCRIPT_ITEM-RUN",
      title: "运行脚本(介绍)",
      description: "运行此脚本",
    },
  ],
  scriptEditor: [],
  scriptRunConsole: [],
  scriptSetting: [],
  apiTest: [],
  codeSnippetList: [],
  setting: [],
  account: [],
};
