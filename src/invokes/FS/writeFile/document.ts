export const apiDocument = <ApiDocumentType>{
  howToUse: "将文本写入文件",
  params: [
    {
      name: "path",
      required: true,
      instructions: "目标文件的绝对路径",
      type: "string",
      default: "",
      children: [],
    },
    {
      name: "content",
      required: true,
      instructions: "文本内容",
      type: "string",
      default: "",
      children: [],
    },
  ],
  returnValue: {
    instructions: "是否写入成功",
    type: "Promise<boolean>",
  },
  example: {
    title: "该API在'测试调用'后会动态填入参数到示例",
    code: 'const res = await writeFile("E://example.txt", "示例文本");',
  },
  searchKeys: ["write", "fs", "file"],
  codeSnippet:
    "${1:const res = }await writeFile(${2:'path'}, ${3:'content'});${0:}",
};
