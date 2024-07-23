export const apiDocument = <ApiDocumentType>{
  howToUse:
    "delayTime毫秒后会对当前屏幕进行截图，之后会有一个截图范围选择的窗口出现，第一次可能不会置顶，需要手动呼出，从起点开始长按拖动鼠标到终点释放，返回对应的范围参数。",
  params: [
    {
      name: "delayTime",
      required: false,
      instructions: "延迟执行时间(s)",
      type: "number",
      default: "0",
    },
  ],
  returnValue: {
    type: "Promise<{ startX:number; startY:number; width:number; height:number; }>",
  },
  example: {
    code: `const { startX, startY, width, height } = await getScreenRectInfo();`,
  },
  searchKeys: ["屏幕", "矩形", "范围", "位置"],
  codeSnippet:
    "const { startX, startY, width, height } = await getScreenRectInfo(${1:delayTime});",
};
