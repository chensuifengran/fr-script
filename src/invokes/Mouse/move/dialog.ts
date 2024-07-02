export const dialogOptions = {
  title: "模拟鼠标移动",
  targetMethodName: "move",
  content: "模拟鼠标移动到指定坐标,位置受Mouse.setMouseOption设置的选项影响",
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
      name: "isRelative",
      componentType: "switch",
      value: false,
      label: "相对当前位置移动",
      activeText:"相对移动",
      inactiveText:"绝对移动"
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
