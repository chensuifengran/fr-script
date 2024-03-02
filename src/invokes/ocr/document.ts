export const apiDocument = <ApiDocumentType>{
  howToUse: "识别屏幕/图片指定位置，返回识别结果",
  params: [
    {
      name: "x",
      required: false,
      instructions: "识别区域起点X坐标",
      type: "number",
      default: "-1",
    },
    {
      name: "y",
      required: false,
      instructions: "识别区域起点y坐标",
      type: "number",
      default: "-1",
    },
    {
      name: "width",
      required: false,
      instructions: "识别区域宽度",
      type: "number",
      default: "-1",
    },
    {
      name: "height",
      required: false,
      instructions: "识别区域高度",
      type: "number",
      default: "-1",
    },
    {
      name: "imgPath",
      required: false,
      instructions: "图片路径, 为空时识别屏幕内容",
      type: "string",
      default: "",
    },
  ],
  returnValue: {
    type: codeHighLight("Promise<OcrUtil | undefined>"),
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: codeHighLight(
      `const result = await ocr(0, 0, 100, 100, "E:\\\\image.png");`
    ),
  },
  searchKeys: ["OCR", "ocr", "图片", "指定范围"],
  codeSnippet:
    "const ${1:res} = await ocr(${2:-x}, ${3:-y}, ${4:width}, ${5:height}, '${6:imagePath}')",
};
