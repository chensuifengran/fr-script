export const apiDocument = <ApiDocumentType>{
  howToUse: `
      将屏幕指定范围进行截图与多模板图片进行位置差异对比
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
      name: "tempPaths",
      required: true,
      instructions: "模板图片路径，模板图片路径之间用|分隔",
      type: "string",
      default: "",
    },
    {
      name: "targetIndex",
      required: false,
      instructions: "主模板图片索引, 其余模板会携带与主模板的位置差异",
      type: "number",
      default: "0",
    },
    {
      name: "drive",
      required: false,
      instructions: "临时截图存放的盘符",
      type: "string",
      default: "'auto'",
    },
  ],
  returnValue: {
    type: codeHighLight(`Promise<{
      \t\tx:number;
      \t\ty:number;
      \t\twidth:number;
      \t\theight:number;
      \t\tcenterX:number;
      \t\tcenterY:number;
      \t\ttargetOffsetX:number;
      \t\ttargetOffsetY:number;
    \t}[] | undefined>`),
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: codeHighLight(
      `//多模板与主模板的位置差异匹配
          const res = await CV.screenDiffTemplates(0, 0, 100, 100, 'E:\\\\template1.png|E:\\\\template2.png', 0, 'D');
          `
    ),
  },
  searchKeys: ["模板", "图片", "位置", "中心坐标"],
  codeSnippet:
    "const res = await CV.screenDiffTemplates(${1:x}, ${2:y}, ${3:width}, ${4:height}, '${5:tempPaths}', ${6:targetIndex});",
};
