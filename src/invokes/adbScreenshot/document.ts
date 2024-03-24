export const apiDocument = <ApiDocumentType>{
    howToUse: `ADB截图`,
    returnValue: {
      type: codeHighLight(`Promise<string>`),
      instructions: "截图结果",
    },
    example: {
      code: codeHighLight(`const res = await adbScreenshot();`),
    },
    searchKeys: ["ADB",'adb', "截图"],
    codeSnippet: "await adbScreenshot();",
  }