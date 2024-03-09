export const dialogOptions = {
  title: "获得指定坐标颜色",
  targetMethodName: "screenColor",
  content:
    "获取[指定坐标/鼠标所在坐标]像素点的rgb值,x、y坐标任意值为-1时使用鼠标位置",
  args: [
    {
      name: "x",
      componentType: "numberInput",
      value: -1,
      label: "x坐标",
    },
    {
      name: "y",
      componentType: "numberInput",
      value: -1,
      label: "y坐标",
    },
    {
      name: "delay",
      componentType: "numberInput",
      value: 0,
      label: "延迟执行时间(ms)【仅测试】",
      onlyTest: true,
    },
  ],
};
