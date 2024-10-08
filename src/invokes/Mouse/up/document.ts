export const apiDocument = <ApiDocumentType>{
  howToUse:
    "鼠标移动到指定位置进行[左键/右键/中键]抬起，一般用于鼠标按键按下API调用之后主动抬起,位置受Mouse.setMouseOption设置的选项影响",
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
      instructions: "抬起的鼠标键，默认值为左键",
      type: ["left", "right", "middle"],
      default: "left",
    },
  ],
  returnValue: {
    type: "Promise<boolean>",
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: `//鼠标移动到(100,100)并抬起(左键)
await Mouse.up(100,100);
//鼠标移动到(100,100)并抬起(右键)
await Mouse.up(100,100,"right");
//鼠标移动到(100,100)并抬起(中键)
await Mouse.up(100,100,"middle");
      `,
  },
  searchKeys: ["鼠标", "mouse", "左键", "中键", "右键", "抬起", "移动"],
  codeSnippet: "await Mouse.up(${1:x}, ${2:y});",
};
