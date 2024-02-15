export const apiDocument = <ApiDocumentType>{
  howToUse: `滑动`,
  params: [
    {
      name: "fromX",
      required: true,
      instructions: "起始X坐标",
      type: "number",
      default: "",
    },
    {
      name: "fromY",
      required: true,
      instructions: "起始Y坐标",
      type: "number",
      default: "",
    },
    {
      name: "toX",
      required: true,
      instructions: "结束X坐标",
      type: "number",
      default: "",
    },
    {
      name: "toY",
      required: true,
      instructions: "结束Y坐标",
      type: "number",
      default: "",
    },
    {
      name: "slideTime",
      required: true,
      instructions: "滑动时间(ms)",
      type: "number",
      default: "",
    },
  ],
  returnValue: {
    type: codeHighLight(`Promise<string>`),
    instructions: "滑动结果",
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: codeHighLight(`const res = await slideTo(100, 100, 200, 200, 1000);`),
  },
  searchKeys: ["ADB",'adb', "滑动"],
  codeSnippet: "await slideTo(${1:fromX}, ${2:fromY}, ${3:toX}, ${4:toY}, ${5:slideTime});",
};
