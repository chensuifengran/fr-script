export const dialogOptions = {
  title: "拖动鼠标到指定位置",
  targetMethodName: "drag",
  content: "拖动鼠标到指定位置[x或y的值任意<0时为表示使用当前鼠标位置作为起点],位置受Mouse.setMouseOption设置的选项影响",
  args: [
    {
      name: "x",
      componentType: "numberInput",
      value: 0,
      label: "x坐标",
    },
    {
      name: "y",
      componentType: "numberInput",
      value: 0,
      label: "y坐标",
    },
    {
      name: "toX",
      componentType: "numberInput",
      value: 0,
      label: "目标x坐标(>=0)",
    },
    {
      name: "toY",
      componentType: "numberInput",
      value: 0,
      label: "目标y坐标(>=0)",
    },
    {
      name: "duration",
      componentType: "numberInput",
      value: 0,
      label: "拖动时间(ms)",
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
