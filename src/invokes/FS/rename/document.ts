export const apiDocument = <ApiDocumentType>{
  howToUse:
    "将旧路径的文件或文件夹移动到新路径,如果移动的是文件并且新路径已存在则会覆盖",
  params: [
    {
      name: "oldPath",
      required: true,
      instructions: "旧文件(夹)路径",
      type: "string",
      default: "",
      children: [],
    },
    {
      name: "newPath",
      required: true,
      instructions: "新文件(夹)路径",
      type: "string",
      default: "",
      children: [],
    },
  ],
  returnValue: {
    instructions: "是否移动成功",
    type: "Promise<boolean>",
  },
  example: {
    title: "该API在'测试调用'后会动态填入参数到示例",
    code: 'const res = await rename("E://example","E://example1")',
  },
  searchKeys: ["rename", "move", "file", "dir", "fs"],
  codeSnippet:
    "${1:const res = }await rename(${2:'oldPath'}, ${3:'newPath'});${0:}",
};
