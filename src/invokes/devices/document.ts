export const apiDocument = <ApiDocumentType>{
    howToUse: `获取ADB的设备列表`,
    returnValue: {
      type: codeHighLight(`Promise<string>`),
      instructions: "设备列表",
    },
    example: {
      code: codeHighLight(`const devicesStr = await devices();`),
    },
    searchKeys: ["ADB",'adb', "获取设备列表"],
    codeSnippet: "const ${1:devicesStr} = await devices();",
  }