export const dialogOptions = <TestModuleDialogType>{
  title: "获取文件扩展名",
  targetMethodName: "extname",
  content: "获取文件的扩展名",
  args: [
    {
      componentType: "FileInput",
      value: "",
      suffix: "",
      verifyPath: false,
      desc: "单文件选择",
      id: "ZkNup1zdtqvariUs2FWdl",
      onlyTest: false,
      noTest: false,
      name: "path",
      label: "文件路径",
      displayCondition: [],
      placeholder: "请输入文件路径",
      multiple: false,
    },
  ],
};
