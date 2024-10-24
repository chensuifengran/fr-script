export const apiDocument = <ApiDocumentType>{
  howToUse: "返回路径的目录名",
  params: [
    {
      name: "path",
      required: true,
      instructions: "目标路径",
      type: "string",
      default: "",
      children: [],
    },
  ],
  returnValue: {
    instructions: "路径的目录名 ",
    type: "Promise<string>",
  },
  example: {
    title: "该API在'测试调用'后会动态填入参数到示例",
    code: 'const res = await dirname("E:\\a\\b.png")',
  },
  searchKeys: ["path"],
  codeSnippet: "${1:const res = }await dirname(${2:'path'});${0:}",
};
