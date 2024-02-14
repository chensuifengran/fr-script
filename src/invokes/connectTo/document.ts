export const apiDocument = <ApiDocumentType>{
  howToUse: `连接到指定设备`,
  params: [
    {
      name: "targetDevice",
      required: true,
      instructions: "要连接的设备",
      type: "string",
      default: "",
    },
  ],
  returnValue: {
    type: codeHighLight(`Promise<string>`),
    instructions: "连接结果",
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: codeHighLight(`const res = await connectTo('127.0.0.1:21053');`),
  },
  searchKeys: ["ADB",'adb', "连接设备"],
  codeSnippet: "const ${1:res} = await connectTo('${2:targetDevice}');",
};
