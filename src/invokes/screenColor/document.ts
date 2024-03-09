export const apiDocument = <ApiDocumentType>{
  howToUse: "获取[指定坐标/鼠标所在坐标]像素点的rgb值",
  params: [
    {
      name: "x",
      required: false,
      instructions: "[屏幕x坐标]值为-1时使用鼠标位置",
      type: "number",
      default: "-1",
    },
    {
      name: "y",
      required: false,
      instructions: "[屏幕y坐标]值为-1时使用鼠标位置",
      type: "number",
      default: "-1",
    }
  ],
  returnValue: {
    type: codeHighLight("Promise<[number,number, number] | undefined>")
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: codeHighLight(`//获取屏幕鼠标所在位置像素点的rgb值
        const [r,g,b] = await screenColor();
        //获取屏幕(100,100)处像素点的rgb值
        const [r,g,b] = await screenColor(100, 100);
        `),
  },
  searchKeys: ["颜色", "color", "坐标", "鼠标"],
  codeSnippet:'const [r,g,b] = await screenColor(${1:x}, ${2:y});'
};
