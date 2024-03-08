export const apiDocument = <ApiDocumentType>{
  howToUse: "全局等待快捷键触发",
  params: [
    {
      name: "keys",
      required: true,
      instructions: "等待触发的快捷键，如：['Alt+S','Alt+R']",
      type: "string[]",
      default: "",
    },
  ],
  returnValue: {
    type: codeHighLight(`Promise<string | undefined>`),
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: codeHighLight(`//等待 Alt+S 或 Alt+R 被按下
      const key = await GlobalShortcut.waitKeys(["Alt+S","Alt+R"]);
      //按下Alt+S之后key为"Alt+S"，按下Alt+R之后key为"Alt+R"
      `),
  },
  searchKeys: ["wait", "等待", "按下", "触发"],
  codeSnippet: "const key = await GlobalShortcut.waitKeys(['${1:key}']);",
};
