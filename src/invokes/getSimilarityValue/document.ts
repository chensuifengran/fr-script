export const apiDocument = <ApiDocumentType>{
  howToUse: "图片相似度匹配，从原图指定矩形区域与模板进行匹配",
  params: [
    {
      name: "pathA",
      required: true,
      instructions: "原图路径",
      type: "string",
      default: "",
    },
    {
      name: "pathB",
      required: true,
      instructions: "模板路径",
      type: "string",
      default: "",
    },
    {
      name: "x",
      required: false,
      instructions: "原图x坐标",
      type: "number",
      default: "-1",
    },
    {
      name: "y",
      required: false,
      instructions: "原图y坐标",
      type: "number",
      default: "-1",
    },
    {
      name: "width",
      required: false,
      instructions: "原图截取宽度",
      type: "number",
      default: "-1",
    },
    {
      name: "height",
      required: false,
      instructions: "原图截取高度",
      type: "number",
      default: "-1",
    },
  ],
  returnValue: {
    type: codeHighLight("Promise<number>"),
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: codeHighLight(`//识别E:\\\\image.png从起点(0,0)截取宽100高100的区域与E:\\\\template.png进行相似度匹配
      const similarityValue = 
      \tawait getSimilarityValue('E:\\\\image.png', 'E:\\\\template.png', 0,0,100,100);`),
  },
  searchKeys: ["图片", "相似度", "匹配", "模板"],
  codeSnippet:
    "const similarityValue = await getSimilarityValue('${1:pathA}', '${2:pathB}', ${3:x}, ${4:y}, ${5:width}, ${6:height});",
};
