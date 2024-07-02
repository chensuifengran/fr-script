export const apiDocument = <ApiDocumentType>{
  howToUse: "拖动鼠标到指定位置[x或y的值任意<0时为表示使用当前鼠标位置作为起点],位置受Mouse.setMouseOption设置的选项影响",
  params: [
    {
      name: "x",
      required: true,
      instructions: "x坐标",
      type: "number",
      default: "",
    },
    {
      name: "y",
      required: true,
      instructions: "y坐标",
      type: "number",
      default: "",
    },
    {
      name: "toX",
      required: true,
      instructions: "目标x坐标(>=0)",
      type: "number",
      default: "",
    },
    {
      name: "toY",
      required: true,
      instructions: "目标y坐标(>=0)",
      type: "number",
      default: "",
    },
    {
      name: "duration",
      required: false,
      instructions: "拖动时间",
      type: "number",
      default: "0",
    },
  ],
  returnValue: {
    type: codeHighLight("Promise<boolean>"),
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: codeHighLight(`//从当前鼠标位置拖动到100,100
await Mouse.drag(-1, -1, 100, 100);
//从当前鼠标位置使用500ms拖动到100,100
await Mouse.drag(-1, -1, 100, 100, 500);
    `),
  },
  searchKeys: ["鼠标", "mouse", "拖动", "模拟"],
  codeSnippet: "await Mouse.drag(${1:x}, ${2:y}, ${3:toX}, ${4:toY});",
};
