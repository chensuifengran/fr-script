export const apiDocument = <ApiDocumentType>{
  howToUse: `点击指定位置`,
  params: [
    {
      name: "targetX",
      required: true,
      instructions: "X坐标",
      type: "number",
      default: "",
    },
    {
      name: "targetY",
      required: true,
      instructions: "Y坐标",
      type: "number",
      default: "",
    },
  ],
  returnValue: {
    type: codeHighLight(`Promise<string>`),
    instructions: "ADB设备轻触指定位置结果",
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: codeHighLight(`const res = await touch(100, 100);`),
  },
  searchKeys: ["ADB",'adb', "点击指定位置","轻触","click",'touch'],
  codeSnippet: "await touch(${1:targetX}, ${2:targetY});",
};
