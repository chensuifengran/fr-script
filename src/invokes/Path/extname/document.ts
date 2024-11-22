export const apiDocument = <ApiDocumentType>{
  howToUse: "获取文件的扩展名",
  params: [
    {
      name: "path",
      required: true,
      instructions: "目标文件路径",
      type: "string",
      default: "",
      children: [],
    },
  ],
  returnValue: {
    instructions: "路径的扩展名(不包含.)",
    type: "Promise<string>",
  },
  example: {
    title: "该API在'测试调用'后会动态填入参数到示例",
    code: 'const ext = await extname("E:\\\\a.png");',
  },
  searchKeys: ["path", "ext"],
  codeSnippet: "${1:const res = }await extname(${2:'path'});${0:}",
};
