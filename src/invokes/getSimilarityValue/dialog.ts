export const dialogOptions = {
  title: "图片相似度匹配",
  targetMethodName: "getSimilarityValue",
  content: "图片相似度匹配",
  args: [
    {
      name: "pathA",
      componentType: "FileInput",
      value: "",
      label: "原图路径",
    },
    {
      name: "pathB",
      componentType: "FileInput",
      value: "",
      label: "模板路径",
    },
    {
      name: "rect",
      componentType: "RectInput",
      value: { x: -1, y: -1, width: -1, height: -1 },
      label: "原图指定矩形区域",
      targetSrc: "imgPath",
    },
  ],
};
