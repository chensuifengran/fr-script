export const apiDocument = <ApiDocumentType>{
  howToUse: "识别[屏幕/ADB设备]截图指定坐标颜色，返回颜色工具实例",
  params: [
    {
      name: "x",
      required: true,
      instructions: "图片x坐标",
      type: "number",
      default: "",
    },
    {
      name: "y",
      required: true,
      instructions: "图片y坐标",
      type: "number",
      default: "",
    },
    {
      name: "mod",
      required: false,
      instructions: "值为adb时将在调用前执行adb截图操作",
      type: ["'normal'", "'adb'"],
      default: "'normal'",
    },
  ],
  returnValue: {
    type: "Promise<ColorUtil | undefined>",
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: `//获取屏幕指定位置像素点的rgb值
const colorUtil = await screenshotColor(100, 100);
const [r,g,b] = colorUtil?.getRgb() || [0,0,0];
        `,
  },
  searchKeys: ["颜色", "color", "坐标", "adb", "屏幕"],
  codeSnippet: "const colorUtil = await screenshotColor(${1:x}, ${2:y});",
};
