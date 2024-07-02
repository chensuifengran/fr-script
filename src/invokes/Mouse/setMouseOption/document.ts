export const apiDocument = <ApiDocumentType>{
  howToUse: "设置Mouse模块的选项。",
  params: [
    {
      name: "option",
      required: true,
      instructions: "可以设置点击随机偏移、基准屏幕像素等选项",
      type: "MouseOption",
      default: "{}",
    },
  ],
  returnValue: {
    type: codeHighLight(`void`),
  },
  example: {
    code: codeHighLight(
      `//设置鼠标随机偏移、设置基准屏幕像素 设置完成之后，鼠标点击、拖动等API会受到这些选项的影响
Mouse.setMouseOption({
  randomOffset: [
    [-2, 2], //x坐标偏移量[最小值,最大值]
    [-1, 1]  //y坐标偏移量[最小值,最大值]
  ],
  baseSize: [1920, 1080] //基准屏幕像素
});
`
    ),
  },
  searchKeys: [
    "config",
    "option",
    "mouse",
    "randomOffset",
    "baseSize",
    "鼠标",
    "配置",
    "选项",
  ],
  codeSnippet: `Mouse.setMouseOption({
  \${1:randomOffset: [
    [0, 0], //x坐标偏移量[最小值,最大值]
    [0, 0]  //y坐标偏移量[最小值,最大值]
  ],}
  \${2:baseSize: [1920, 1080] //基准屏幕像素}
});\${0}
`,
};
