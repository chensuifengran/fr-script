export const dialogOptions = {
  title: "识别屏幕/图片指定位置内容",
  targetMethodName: "ocr",
  content:
    "如需识别屏幕内容，图片路径无需填写。如需识别图片内容，需填写图片路径。",
  args: [
    {
      name: "rect",
      componentType: "rectInput",
      value: {
        x: -1,
        y: -1,
        width: -1,
        height: -1,
      },
      label: "识别区域",
      targetSrc: "imgPath",
    },
    {
      name: "imgPath",
      componentType: "fileInput",
      value: "",
      label: "图片路径",
    },
  ],
};
