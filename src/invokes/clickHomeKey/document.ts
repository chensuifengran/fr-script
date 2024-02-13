export const apiDocument = <ApiDocumentType>{
  howToUse: `点击当前连接ADB设备的Home键`,
  returnValue: {
    type: codeHighLight(`Promise<string>`),
    instructions: "点击Home键结果, 一般用不上",
  },
  example: {
    code: codeHighLight(`await ADB.clickHomeKey();`),
  },
  searchKeys: ["ADB", "adb", "点击Home键", "home", "key"],
  codeSnippet: "await ADB.clickHomeKey();",
};
