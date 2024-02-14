
export const apiDocument = <ApiDocumentType>{
    howToUse: `与目标设备断开连接`,
    params: [
      {
        name: "targetDevice",
        required: true,
        instructions: "要断开连接的设备",
        type: 'string',
        default: "",
      },
    ],
    returnValue: {
      type: codeHighLight(`Promise<string>`),
      instructions: "断开连接结果",
    },
    example: {
      title: '该API在"测试调用"后会动态填入参数到示例',
      code: codeHighLight(
        `const res = await disConnectTo('127.0.0.1:21053');`
      ),
    },
    searchKeys: ["ADB",'adb', "断开连接设备"],
    codeSnippet: "const ${1:res} = await disConnectTo('${2:targetDevice}');",
  }