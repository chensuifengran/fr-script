export const dialogOptions = <TestModuleDialogType>{
  title: "读取文件内容",
  targetMethodName: "readFile",
  content: "读取指定路径的文件内容",
  args: [
    {
      componentType: "fileInput",
      value: "",
      suffix: "",
      verifyPath: false,
      desc: "单文件选择",
      id: "BZSXGSadzZcAtUZm6ePro",
      onlyTest: false,
      noTest: false,
      name: "path",
      label: "文件路径",
      displayCondition: [],
      placeholder: "请选择需要读取内容的文件所在路径",
      multiple: false,
    },
  ],
};
