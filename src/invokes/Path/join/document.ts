export const apiDocument = <ApiDocumentType>{
  howToUse:
    "使用特定于平台的分隔符作为分隔符将所有给定的路径段连接在一起，然后规范化生成的路径。 ",
  params: [
    {
      name: "path",
      required: true,
      instructions: "主路径",
      type: "string",
      default: "",
      children: [],
    },
    {
      name: "addPath",
      required: true,
      instructions: "路径表达式",
      type: "string",
      default: "",
      children: [],
    },
  ],
  returnValue: {
    instructions: "拼接后的路径",
    type: "Promise<string>",
  },
  example: {
    title: "该API在'测试调用'后会动态填入参数到示例",
    code: 'const res = await join("E:\\\\a","./b.png");',
  },
  searchKeys: ["path"],
  codeSnippet: "${1:const res = }await join(${2:'path'}, ${3:'addPath'});${0:}",
};
