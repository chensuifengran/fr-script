export const apiDocument = <ApiDocumentType>{
  howToUse: "鼠标移动到指定位置进行[左键/右键/中键]的按下（不会主动抬起）",
  params: [
    {
      name: "x",
      required: true,
      instructions: "鼠标移动到的X坐标",
      type: "number",
      default: "",
    },
    {
      name: "y",
      required: true,
      instructions: "鼠标移动到的Y坐标",
      type: "number",
      default: "",
    },
    {
      name: "button",
      required: false,
      instructions: "需要按下的鼠标键，默认值为左键",
      type: ["left", "right", "middle"],
      default: "left",
    },
  ],
  returnValue: {
    type: codeHighLight("Promise<void>"),
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: codeHighLight(`//鼠标移动到(100,100)并按下(左键)
await Mouse.down(100,100);
//鼠标移动到(100,100)并按下(右键)
await Mouse.down(100,100,"right");
//鼠标移动到(100,100)并按下(中键)
await Mouse.down(100,100,"middle");
      `),
  },
  searchKeys: ["鼠标", "mouse", "左键", "中键", "右键", "按下", "移动"],
  codeSnippet: "await Mouse.down(${1:x}, ${2:y});",
};
