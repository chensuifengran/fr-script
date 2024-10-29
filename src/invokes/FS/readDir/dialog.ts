export const dialogOptions = <TestModuleDialogType>{
  title: "读取文件夹",
  targetMethodName: "readDir",
  content: "获取文件夹的所有子文件或子文件夹",
  args: [
    {
      componentType: "dirInput",
      value: "",
      suffix: "",
      verifyPath: false,
      desc: "文件夹选择",
      id: "YS1ux1d9_8FelG1KPOsCn",
      onlyTest: false,
      noTest: false,
      name: "path",
      label: "文件夹路径",
      displayCondition: [],
      placeholder: "请输入文件夹路径",
    },
  ],
};
