export const apiDocument = <ApiDocumentType>{
  howToUse: `
      匹配模板图片在原图中的坐标
      匹配规则：
      * 开始对两张图片进行校验路径是否有误、两张图片相似度是否<=0，若发生其中一种情况则x=-1,y=-1。
      * 若两张图片有相似度，则进行坐标匹配，接下来看exactValue是否=0,
      * 是则直接返回匹配区域中心坐标。
      * 否则只返回大于等于精确值(exactValue)的匹配结果，对于小于精确值的则返回x=-1,y=-1。
      `,
  params: [
    {
      name: "imgPath",
      required: true,
      instructions: "待匹配图片路径",
      type: "string",
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
        "精确值(=0直接返回匹配结果，否则只返回大于等于精确值的匹配结果，对于小于匹配值的则返回{x:-1,y:-1})",
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
    code: `const matchUtil = 
    await CV.matchTemplate('E:\\\\image.png', 'E:\\\\template.png', 0, 1);`,
  },
  searchKeys: ["模板", "图片", "位置", "中心坐标", "opencv", "cv", "匹配"],
  codeSnippet:
    "const matchUtil = await CV.matchTemplate('${1:imgPath}', '${2:tempPath}', ${3:exactValue}, ${4:scale});",
};
