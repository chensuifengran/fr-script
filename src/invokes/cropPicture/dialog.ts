export const dialogOptions = {
  title: "裁剪图片",
  targetMethodName: "cropPicture",
  content: "裁剪图片",
  args: [
    {
      name: "path",
      componentType: "FileInput",
      value: "",
      label: "待裁剪图片路径",
    },
    {
      name: "range",
      componentType: "RectInput",
      targetSrc: "path",
      label: "裁剪区域",
      value: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
    },
    {
      name: "outPath",
      componentType: "FileInput",
      value: "",
      label: "裁剪后输出路径",
    },
  ],
};
