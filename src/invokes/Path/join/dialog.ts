export const dialogOptions = <TestModuleDialogType>{
  title: "路径拼接",
  targetMethodName: "join",
  content:
    "使用特定于平台的分隔符作为分隔符将所有给定的路径段连接在一起，然后规范化生成的路径。 ",
  args: [
    {
      componentType: "fileInput",
      value: "",
      suffix: "",
      verifyPath: false,
      desc: "单文件选择",
      id: "767VuT62vlbQUwwjZal1J",
      onlyTest: false,
      noTest: false,
      name: "path",
      label: "主路径",
      displayCondition: [],
      placeholder: "请输入主路径",
      multiple: false,
    },
    {
      componentType: "input",
      value: "",
      desc: "文本输入框",
      id: "YZoEkbl1OLRtFMV0y4w46",
      onlyTest: false,
      noTest: false,
      name: "addPath",
      label: "路径表达式",
      displayCondition: [],
      placeholder: "请输入路径表达式",
    },
  ],
};
