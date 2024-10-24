export const dialogOptions = <TestModuleDialogType>{
  title: "获得路径的目录名",
  targetMethodName: "dirname",
  content: "返回路径的目录名",
  args: [
    {
      componentType: "FileInput",
      value: "",
      suffix: "",
      verifyPath: false,
      desc: "单文件选择",
      id: "xr40WPMrmLWk0SkDf3nXF",
      onlyTest: false,
      noTest: false,
      name: "path",
      label: "目标路径",
      displayCondition: [],
      placeholder: "请输入目标路径",
      multiple: false,
    },
  ],
};
