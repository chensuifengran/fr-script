export const apiDocument = <ApiDocumentType>{
  howToUse: "鼠标移动到指定位置进行[左键/中键/右键]点击",
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
      instructions: "点击的鼠标键，默认值为左键",
      type: ["left", "right", "middle"],
      default: "left",
    },
  ],
  returnValue: {
    type: codeHighLight("Promise<void>"),
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: codeHighLight(`//鼠标移动到(100,100)并点击(左键)
      await Mouse.click(100,100);
      //鼠标移动到(100,100)并点击(右键)
      await Mouse.click(100,100,"right");
      //鼠标移动到(100,100)并点击(中键)
      await Mouse.click(100,100,"middle");
      `),
  },
  searchKeys: ["鼠标", "mouse", "左键", "中键", "右键", "点击", "移动"],
  codeSnippet: "await Mouse.click(${1:x}, ${2:y});",
};
