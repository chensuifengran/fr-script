export const apiDocument = <ApiDocumentType>{
  howToUse: "读取文件夹内的文件",
  params: [
    {
      name: "path",
      required: true,
      instructions: "文件夹的绝对路径",
      type: "string",
      default: "",
      children: [],
    },
  ],
  returnValue: {
    instructions:
      "文件描述对象，fileName为文件或文件夹名称，fileType为文件或者文件夹",
    type: 'Promise<{fileName: string;fileType: "file" | "dir";}[]>',
  },
  example: {
    title: "该API在'测试调用'后会动态填入参数到示例",
    code: 'const files = await readDir("E://exampleDir");',
  },
  searchKeys: ["read", "fs", "dir"],
  codeSnippet: "${1:const res = }await readDir(${2:'path'});${0:}",
};
