export const apiDocument = <ApiDocumentType>{
  howToUse: "传入图片路径以及截取参数、输出路径",
  params: [
    {
      name: "path",
      required: true,
      instructions: "图片的绝对路径",
      type: "string",
      default: "",
    },
    {
      name: "x",
      required: true,
      instructions: "截取起点X坐标",
      type: "number",
      default: "",
    },
    {
      name: "y",
      required: true,
      instructions: "截取起点y坐标",
      type: "number",
      default: "",
    },
    {
      name: "width",
      required: true,
      instructions: "从截取起点开始的截取宽度",
      type: "number",
      default: "",
    },
    {
      name: "height",
      required: true,
      instructions: "从截取起点开始的截取高度",
      type: "number",
      default: "",
    },
    {
      name: "outPath",
      required: true,
      instructions: "截取后图片的输出路径",
      type: "string",
      default: "",
    },
  ],
  returnValue: {
    type: codeHighLight("Promise<number>"),
    instructions: "返回1为截取成功。",
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: codeHighLight(
      `const res = await cropPicture('path',x,y,width,height,'outPath');`
    ),
  },
  searchKeys: ["截取", "裁剪", "图片"],
  codeSnippet:
    "const ${1:res} = await cropPicture('${2:path}', ${3:x}, ${4:y}, ${5:width}, ${6:height}, '${7:outPath}');",
};
