export const dialogOptions = {
  title: "点击指定位置",
  targetMethodName: "touch",
  content: "请输入要点击的坐标",
  args: [
    {
      name: "targetX",
      componentType: "numberInput",
      label: "X坐标",
      value: 0,
    },
    {
      name: "targetY",
      componentType: "numberInput",
      label: "Y坐标",
      value: 0,
    },
  ],
};
