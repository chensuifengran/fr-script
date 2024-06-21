export const apiDocument = <ApiDocumentType>{
  howToUse: "识别屏幕指定坐标颜色，返回颜色工具实例",
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
    type: codeHighLight("Promise<ColorUtil | undefined>")
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: codeHighLight(`//获取屏幕鼠标所在位置像素点的rgb值
const colorUtil = await screenColor();
const [r,g,b] = colorUtil?.getRgb() || [0,0,0];
        `),
  },
  searchKeys: ["颜色", "color", "坐标", "鼠标"],
  codeSnippet:'const colorUtil = await screenColor(${1:x}, ${2:y});'
};
