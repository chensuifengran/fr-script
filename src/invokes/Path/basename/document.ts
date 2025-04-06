export const apiDocument = <ApiDocumentType>{
  howToUse: "返回路径的最后一部分",
  params: [
    {
      name: "path",
      required: true,
      instructions: "目标路径",
      type: "string",
      default: "",
      children: [],
    },
    {
      name: "ext",
      required: false,
      instructions: "要从返回的路径中删除文件的扩展名 ",
      type: "string",
      default: "",
      children: [],
    },
  ],
  returnValue: {
    instructions: "路径的最后一部分",
    type: "Promise<string>",
  },
  example: {
    title: "该API在'测试调用'后会动态填入参数到示例",
    code: 'const res = await basename("E:\\\\a.png","png");',
  },
  searchKeys: ["path"],
  codeSnippet: "${1:const res = }await basename(${2:'path'}${3:, ''});${0:}",
};
