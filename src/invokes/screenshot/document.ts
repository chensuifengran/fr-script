export const apiDocument = <ApiDocumentType>{
  howToUse: "屏幕截图，支持自定义矩形范围截图以及全屏截图",
  params: [
    {
      name: "x",
      required: false,
      instructions: "[范围参数]截图起点x坐标,范围参数任意一个值为-1会全屏截图",
      type: "number",
      default: "-1",
    },
    {
      name: "y",
      required: false,
      instructions: "[范围参数]截图起点y坐标,范围参数任意一个值为-1会全屏截图",
      type: "number",
      default: "-1",
    },
    {
      name: "width",
      required: false,
      instructions: "[范围参数]截图宽度,范围参数任意一个值为-1会全屏截图",
      type: "number",
      default: "-1",
    },
    {
      name: "height",
      required: false,
      instructions: "[范围参数]截图高度,范围参数任意一个值为-1会全屏截图",
      type: "number",
      default: "-1",
    },
    {
      name: "path",
      required: false,
      instructions: "截图保存路径",
      type: "string",
      default: "设置中的截图保存路径",
    },
  ],
  returnValue: {
    type: codeHighLight("Promise<number>"),
    instructions: "返回1为截图成功。",
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: codeHighLight(`//全屏截图且使用默认保存路径
        const res = await screenshot();
        //自定义截图区域且使用默认保存路径
        const res = await screenshot(x,y,width,height);
        //自定义截图区域且使用自定义保存路径
        const res = await screenshot(x,y,width,height,"E:\\\\image.png");
        `),
  },
  searchKeys: ["截图", "屏幕"],
  codeSnippet:'const res = await screenshot(${1:x}, ${2:y}, ${3:width}, ${4:height});'
};
