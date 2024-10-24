export const dialogOptions = <TestModuleDialogType>{
  title: "获取路径的最后一部分",
  targetMethodName: "basename",
  content: "返回路径的最后一部分",
  args: [
    {
      componentType: "FileInput",
      value: "",
      suffix: "",
      verifyPath: false,
      desc: "单文件选择",
      id: "tjZIw1naGW_0PC94z0wbE",
      onlyTest: false,
      noTest: false,
      name: "path",
      label: "目标路径",
      displayCondition: [],
      placeholder: "请输入目标路径",
      multiple: false,
    },
    {
      componentType: "input",
      value: "",
      desc: "文本输入框",
      id: "WB4Ge_ckM6GCIydCPD3s8",
      onlyTest: false,
      noTest: false,
      name: "ext",
      label: "要删除的文件扩展名",
      displayCondition: [],
      placeholder: "要删除的文件扩展名，留空则不删除",
    },
  ],
};
