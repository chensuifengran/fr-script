export const apiDocument = <ApiDocumentType>{
  howToUse: `获取设备状态`,
  returnValue: {
    type: codeHighLight(`Promise<string>`),
    instructions: "设备状态",
  },
  example: {
    code: codeHighLight(`const res = await adbState();`),
  },
  searchKeys: ["ADB",'adb', "获取设备状态"],
  codeSnippet: "const ${1:res} = await adbState();",
};
