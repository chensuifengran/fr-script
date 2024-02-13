export const apiDocument = <ApiDocumentType>{
  howToUse: `点击返回键`,
  returnValue: {
    type: codeHighLight(`Promise<string>`),
    instructions: "点击返回键结果, 一般用不上",
  },
  example: {
    code: codeHighLight(`await ADB.clickReturnKey();`),
  },
  searchKeys: ["ADB", "adb", "点击返回键", "return", "key"],
  codeSnippet: "await ADB.clickReturnKey();",
};
