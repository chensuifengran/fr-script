export const dialogOptions = {
  title: "滑动",
  targetMethodName: "slideTo",
  content: "请输入要滑动的坐标",
  args: [
    {
      name: "fromX",
      componentType: "numberInput",
      label: "起始X坐标",
      value: 0,
    },
    {
      name: "fromY",
      componentType: "numberInput",
      label: "起始Y坐标",
      value: 0,
    },
    {
      name: "toX",
      componentType: "numberInput",
      label: "结束X坐标",
      value: 0,
    },
    {
      name: "toY",
      componentType: "numberInput",
      label: "结束Y坐标",
      value: 0,
    },
    {
      name: "slideTime",
      componentType: "numberInput",
      label: "滑动时间",
      value: 0,
    },
  ],
};
