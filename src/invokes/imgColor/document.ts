export const apiDocument = <ApiDocumentType>{
  howToUse: "识别图片指定坐标颜色，返回颜色工具实例",
  params: [
    {
      name: "path",
      required: true,
      instructions: "图片路径",
      type: "string",
      default: "",
    },
    {
      name: "x",
      required: true,
      instructions: "图片x坐标",
      type: "number",
      default: "",
    },
    {
      name: "y",
      required: true,
      instructions: "图片y坐标",
      type: "number",
      default: "",
    }
  ],
  returnValue: {
    type: codeHighLight("Promise<ColorUtil | undefined>")
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: codeHighLight(`//获取图片指定位置像素点的rgb值
        const colorUtil = await imgColor('E:\\test.png', 100, 100);
        const [r,g,b] = colorUtil?.getRgb() || [0,0,0];
        `),
  },
  searchKeys: ["颜色", "color", "坐标", "鼠标"],
  codeSnippet:'const colorUtil = await imgColor(${1:path}, ${2:x}, ${3:y});'
};
