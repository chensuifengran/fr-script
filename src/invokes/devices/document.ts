export const apiDocument = <ApiDocumentType>{
  howToUse: `获取ADB的设备列表`,
  returnValue: {
    type: `Promise<string[] | undefined>`,
    instructions: "设备列表",
  },
  example: {
    code: `const deviceList = await devices();`,
  },
  searchKeys: ["ADB", "adb", "获取设备列表"],
  codeSnippet: "const ${1:deviceList} = await devices();",
};
