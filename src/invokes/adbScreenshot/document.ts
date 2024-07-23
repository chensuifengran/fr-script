export const apiDocument = <ApiDocumentType>{
    howToUse: `ADB截图`,
    returnValue: {
      type: "Promise<string>",
      instructions: "截图结果",
    },
    example: {
      code: `const res = await adbScreenshot();`,
    },
    searchKeys: ["ADB",'adb', "截图"],
    codeSnippet: "await adbScreenshot();",
  }