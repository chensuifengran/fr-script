
export const apiDocument = <ApiDocumentType>{
  howToUse:
    "获取在指定图片中选取矩形的起始点和宽高。",
  params: [
    {
      name: "imgPath",
      required: true,
      instructions: "图片路径",
      type: "string",
      default: "",
    },
  ],
  returnValue: {
    type: codeHighLight(
      "Promise<{ startX:number; startY:number; width:number; height:number; }>"
    ),
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: codeHighLight(
      `const { startX, startY, width, height } = await getImgRectInfo("E:\\\\image.png");`
    ),
  },
  searchKeys: ["图片", "矩形", "位置信息"],
  codeSnippet:'const { startX, startY, width, height } = await getImgRectInfo("${1:imgPath}");'
};
