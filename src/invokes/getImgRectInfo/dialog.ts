export const dialogOptions = {
  title: "在图片选取矩形信息",
  targetMethodName: "getImgRectInfo",
  content:
    "获取在指定图片中选取矩形的起始点和宽高",
  args: [
    {
      name: "imgPath",
      componentType: "fileInput",
      value: "",
      label: "图片路径",
    },
  ],
};
