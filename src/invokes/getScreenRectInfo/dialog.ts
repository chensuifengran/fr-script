export const dialogOptions = {
  title: "屏幕矩形信息",
  targetMethodName: "getScreenRectInfo",
  content:
    "获取在当前屏幕截图选取的矩形起始点以及宽高。",
  args: [
    {
      name: "delayTime",
      componentType: "numberInput",
      value: 0,
      label: "延迟执行时间(s)",
    },
  ],
};
