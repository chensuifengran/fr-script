export const apiDocument = <ApiDocumentType>{
  howToUse: `获取设备状态`,
  returnValue: {
    type: `Promise<string>`,
    instructions: "设备状态",
  },
  example: {
    code: `const res = await adbState();`,
  },
  searchKeys: ["ADB",'adb', "获取设备状态"],
  codeSnippet: "const ${1:res} = await adbState();",
};
