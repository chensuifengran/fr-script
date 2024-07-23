export const apiDocument = <ApiDocumentType>{
  howToUse: "传入待获取宽高的图片路径",
  params: [
    {
      name: "imgPath",
      required: true,
      instructions: "图片的绝对路径",
      type: "string",
      default: "",
    },
  ],
  returnValue: {
    type: "Promise<{ width:number; height:number; }>",
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: 'const { width, height } = await getImageSize("E:\\\\image.png");',
  },
  searchKeys: ["图片", "宽高", "获取"],
  codeSnippet: 'const { width, height } = await getImageSize("${1:imgPath}");',
};
