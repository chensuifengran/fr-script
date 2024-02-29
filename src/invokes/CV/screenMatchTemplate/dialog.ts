export const dialogOptions = {
  title: "屏幕模板匹配",
  targetMethodName: "screenMatchTemplate",
  content: `
      将屏幕指定范围进行截图与模板图片对比，若匹配失败则返回{x:-1,y:-1}/{x:-2,y:-2}
      `,
  args: [
    {
      name: "range",
      componentType: "RectInput",
      value: {
        x: -1,
        y: -1,
        width: -1,
        height: -1,
      },
      label: "截图范围",
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
        "精确值(=0直接返回匹配结果，否则只返回大于等于精确值的匹配结果，对于小于匹配值的则由回调函数返回{x:-1,y:-1})",
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
    {
      name: "drive",
      componentType: "select",
      options: ["auto", "C", "D", "E", "F", "G", "H", "I", "J", "K"],
      value: "auto",
      label: "临时截图存放的盘符",
    },
  ],
};
