export const apiDocument = <ApiDocumentType>{
  howToUse: "输入字符串",
  params: [
    {
      name: "text",
      required: true,
      instructions: "需要输入的内容",
      type: "string",
      default: "",
    },
  ],
  returnValue: {
    type: codeHighLight(
      `Promise<{
  code: number;
  message: string;
}>`
    ),
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: codeHighLight(`//输入"abc"
await Input.text("abc");`),
  },
  searchKeys: ["text", "输入", "input", "文本"],
  codeSnippet: "await Input.text('${1:text}');",
};
