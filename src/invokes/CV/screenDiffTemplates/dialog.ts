export const dialogOptions = {
  title: "屏幕中多模板的位置差异匹配",
  targetMethodName: "screenDiffTemplates",
  content: `
      将屏幕指定范围进行截图中多模板图片位置差异对比
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
      name: "tempPaths",
      componentType: "FileInput",
      value: "",
      label: "模板图片路径，模板图片路径之间用|分隔",
    },
    {
      name: "targetIndex",
      componentType: "numberInput",
      value: 0,
      label: "主模板图片索引, 其余模板会携带与主模板的位置差异",
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
