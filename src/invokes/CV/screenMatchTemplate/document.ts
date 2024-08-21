export const apiDocument = <ApiDocumentType>{
  howToUse: `
      将屏幕指定范围进行截图与模板图片对比
      `,
  params: [
    {
      name: "x",
      required: true,
      instructions: "截图起点x坐标",
      type: "number",
      default: "",
    },
    {
      name: "y",
      required: true,
      instructions: "截图起点y坐标",
      type: "number",
      default: "",
    },
    {
      name: "width",
      required: true,
      instructions: "截图宽度",
      type: "number",
      default: "",
    },
    {
      name: "height",
      required: true,
      instructions: "截图高度",
      type: "number",
      default: "",
    },
    {
      name: "tempPath",
      required: true,
      instructions: "模板图片路径",
      type: "string",
      default: "",
    },
    {
      name: "exactValue",
      required: false,
      instructions:
        "精确值(=0直接返回匹配结果，否则只返回大于等于精确值的匹配结果，对于小于匹配值的则由回调函数返回{x:-1,y:-1})",
      type: "number",
      default: "0",
    },
    {
      name: "scale",
      required: false,
      instructions:
        "缩放倍数(匹配前会把图片缩小scale倍进行匹配，匹配结果会映射scale倍数返回,匹配时间太长可尝试修改本数值)",
      type: "number",
      default: "1",
    },
  ],
  returnValue: {
    type: "Promise<MatchUtil | undefined>",
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: `//使用自动选择临时截图存放盘符
const res = await CV.screenMatchTemplate(0, 0, 100, 100, 'E:\\\\template.png', 0, 1);
//更换临时截图存放盘符为E盘（请确保盘符可用，C盘需要以管理员身份运行）
const res = await CV.screenMatchTemplate(0, 0, 100, 100, 'E:\\\\template.png', 0, 1, 'E');`,
  },
  searchKeys: ["模板", "图片", "位置", "中心坐标", "opencv", "cv", "截图"],
  codeSnippet:
    "const res = await CV.screenMatchTemplate(${1:x}, ${2:y}, ${3:width}, ${4:height}, '${5:tempPath}', ${6:exactValue}, ${7:scale});",
};
