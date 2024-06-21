export const apiDocument = <ApiDocumentType>{
  howToUse: "组合键",
  params: [
    {
      name: "keys",
      required: true,
      instructions: "按下的组合键",
      type: "Key[]",
      default: "",
    },
  ],
  returnValue: {
    type: codeHighLight(
`Promise<{
  code: number;
  message: string;
}>`),
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: codeHighLight(`//按下A键后松开
await Input.combined("A");`),
  },
  searchKeys: ["combined", "key", "组合键", "按键"],
  codeSnippet: "await Input.combined(['${1:key}', '${2:key}']);",
};
