export const apiDocument = <ApiDocumentType>{
  howToUse: "鼠标滚轮滚动",
  params: [
    {
      name: "delta",
      required: true,
      instructions: "滚动的距离，正数向下滚动，负数向上滚动",
      type: "number",
      default: "10",
    },
  ],
  returnValue: {
    type: "Promise<boolean>",
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: `//向下滚动10
await Mouse.wheel(10);`,
  },
  searchKeys: ["鼠标", "mouse", "滚动", "滚轮"],
  codeSnippet: "await Mouse.wheel(${1:delta});",
};
