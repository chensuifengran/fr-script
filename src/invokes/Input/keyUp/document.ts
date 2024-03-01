export const apiDocument = <ApiDocumentType>{
  howToUse: "主动抬起指定按键",
  params: [
    {
      name: "key",
      required: true,
      instructions: "抬起的按键",
      type: "Key",
      default: "",
    },
  ],
  returnValue: {
    type: codeHighLight(`Promise<{
      code: number;
      message: string;
    }>`),
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: codeHighLight(`//主动抬起A键
      await Input.keyUp("A");
      `),
  },
  searchKeys: ["抬起", "输入", "key", "按键"],
  codeSnippet: "await Input.keyUp('${1:key}');",
};
