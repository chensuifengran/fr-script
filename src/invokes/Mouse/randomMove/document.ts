export const apiDocument = <ApiDocumentType>{
  howToUse: `将鼠标移动到指定位置`,
  params: [
    {
      name: "x",
      required: true,
      instructions: "目标位置x坐标",
      type: "number",
      default: "",
    },
    {
      name: "y",
      required: true,
      instructions: "目标位置y坐标",
      type: "number",
      default: "",
    },
    {
      name: "randomRange",
      required: false,
      instructions: "随机偏移",
      type: "[[number,number],[number,number]]",
      default: "[[0,0],[0,0]]",
    },
  ],
  returnValue: {
    type: `Promise<boolean>`,
    instructions: "移动结果",
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: `await randomMove(100,100);`,
  },
  searchKeys: ["mouse", "random", "move", "移动", "随机"],
  codeSnippet: "await Mouse.randomMove(${1:x}, ${2:y}, ${3:[[0,0],[0,0]]});",
};
