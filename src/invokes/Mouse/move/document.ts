export const apiDocument = <ApiDocumentType>{
  howToUse: "鼠标移动到指定[绝对/相对]坐标,位置受Mouse.setMouseOption设置的选项影响",
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
      name: "isRelative",
      required: false,
      instructions: "相对当前位置移动",
      type: "boolean",
      default: "false",
    },
  ],
  returnValue: {
    type: codeHighLight("Promise<boolean>"),
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: codeHighLight(`//移动到(100,100)坐标
await Mouse.move(100, 100);
//鼠标往上移动100，往右移动100
await Mouse.move(100, -100, true);
    `),
  },
  searchKeys: ["鼠标", "mouse", "移动", "模拟"],
  codeSnippet: "await Mouse.move(${1:x}, ${2:y});",
};
