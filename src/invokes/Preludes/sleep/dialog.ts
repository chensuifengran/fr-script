export const dialogOptions = {
  title: "休眠指定时长",
  targetMethodName: "sleep",
  content: "等待指定的毫秒数后继续执行后续操作",
  args: <ArgItem[]>[
    {
      name: "ms",
      componentType: "numberInput",
      value: 1000,
      label: "休眠时长的毫秒数",
    },
  ],
};
