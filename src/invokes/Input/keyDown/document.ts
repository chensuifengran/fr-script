export const apiDocument = <ApiDocumentType>{
  howToUse: "主动按下指定按键，按下后不会自动抬起，需要手动调用keyDown方法抬起按键",
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
      await Input.keyDown("A");
      `),
  },
  searchKeys: ["按下", "输入", "key", "按键"],
  codeSnippet: "await Input.keyDown('${1:key}');",
};
