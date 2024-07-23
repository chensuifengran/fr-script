export const apiDocument = <ApiDocumentType>{
  howToUse: `点击当前连接ADB设备的Home键`,
  returnValue: {
    type: `Promise<string>`,
    instructions: "点击Home键结果, 一般用不上",
  },
  example: {
    code: `await clickHomeKey();`,
  },
  searchKeys: ["ADB", "adb", "点击Home键", "home", "key"],
  codeSnippet: "await clickHomeKey();",
};
