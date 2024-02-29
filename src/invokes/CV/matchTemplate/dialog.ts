export const dialogOptions = {
  title: "图片模板匹配",
  targetMethodName: "matchTemplate",
  content: `
      匹配模板图片在原图中的坐标，返回{x,y}，若匹配失败则返回{-1,-1}
      匹配规则：
      * 开始对两张图片进行校验路径是否有误、两张图片相似度是否<=0，若发生其中一种情况则返回{x:-1,y:-1}
      * 若两张图片有相似度，则进行坐标匹配，接下来看exactValue是否=0,
      * 是则直接返回匹配区域中心坐标，
      * 否则只返回大于等于精确值(exactValue)的匹配结果，对于小于精确值的则返回{x:-1,y:-1}。
      `,
  args: [
    {
      name: "imgPath",
      componentType: "FileInput",
      value: "",
      label: "待匹配图片路径",
    },
    {
      name: "tempPath",
      componentType: "FileInput",
      value: "",
      label: "模板图片路径",
    },
    {
      name: "exactValue",
      componentType: "slider",
      value: 0,
      label:
        "精确值(=0直接返回匹配结果，否则只返回大于等于精确值的匹配结果，对于小于匹配值的则返回{x:-1,y:-1})",
      range: {
        min: 0,
        max: 1,
        step: 0.01,
      },
    },
    {
      name: "scale",
      componentType: "slider",
      value: 1,
      label:
        "缩放倍数(匹配前会把图片缩小scale倍进行匹配，匹配结果会映射scale倍数返回,匹配时间太长可尝试修改本数值)",
      range: {
        min: 1,
        max: 10,
        step: 0.1,
      },
    },
  ],
};
