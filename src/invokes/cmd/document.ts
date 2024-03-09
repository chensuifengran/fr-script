export const apiDocument = <ApiDocumentType>{
  howToUse: `执行cmd命令`,
  params: [
    {
      name: "command",
      required: true,
      instructions: "需要执行的命令",
      type: "string",
      default: "",
    },
    {
      name: "onlyExec",
      required: false,
      instructions: "是否只执行命令，不返回结果",
      type: "boolean",
      default: "false",
    }
  ],
  returnValue: {
    type: codeHighLight(`Promise<string>`),
    instructions: "命令执行结果",
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: codeHighLight(`const res = await cmd("ipconfig");`),
  },
  searchKeys: ["command",'cmd', "命令","执行"],
  codeSnippet: "const res = await cmd('${1:command}');",
};
