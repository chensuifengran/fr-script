export const apiDocument = <ApiDocumentType>{
  howToUse: "读取文件内容",
  params: [
    {
      name: "path",
      required: true,
      instructions: "文件的绝对路径",
      type: "string",
      default: "",
      children: [],
    },
  ],
  returnValue: {
    instructions: "文件的内容",
    type: "Promise<string>",
  },
  example: {
    title: "该API在'测试调用'后会动态填入参数到示例",
    code: 'const content = await readFile("E://example.txt");',
  },
  searchKeys: ["fs", "read", "file"],
  codeSnippet: "${1:const res = }await readFile(${2:'path'});${0:}",
};
