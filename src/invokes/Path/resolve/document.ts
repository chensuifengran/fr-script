export const apiDocument = <ApiDocumentType>{
  howToUse: "将路径或路径段序列解析为绝对路径",
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
    instructions: "解析后的路径",
    type: "Promise<string>",
  },
  example: {
    title: "该API在'测试调用'后会动态填入参数到示例",
    code: 'const newPath = await resolve("E:\\a\\b.png","../c.png")',
  },
  searchKeys: ["path"],
  codeSnippet:
    "${1:const res = }await resolve(${2:'path'}, ${3:'addPath'});${0:}",
};
