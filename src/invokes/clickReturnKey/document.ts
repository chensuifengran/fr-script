export const apiDocument = <ApiDocumentType>{
  howToUse: `点击返回键`,
  returnValue: {
    type: `Promise<string>`,
    instructions: "点击返回键结果, 一般用不上",
  },
  example: {
    code: `await clickReturnKey();`,
  },
  searchKeys: ["ADB", "adb", "点击返回键", "return", "key"],
  codeSnippet: "await clickReturnKey();",
};
