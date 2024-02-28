export const dialogOptions = {
  title: "鼠标滚轮滚动",
  targetMethodName: "wheel",
  content: "模拟鼠标滚轮滚动",
  args: [
    {
      name: "delta",
      componentType: "numberInput",
      value: 0,
      label: "滚动的距离，正数向下滚动，负数向上滚动",
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
