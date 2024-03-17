export const dialogOptions = <TestModuleType['dialog']>{
  title: "鼠标点击器",
  targetMethodName: "clicker",
  content: "鼠标左键进行连续点击一段时间",
  args: [
    {
      name: "duration",
      componentType: "numberInput",
      value: 1,
      label: "连续点击时间(s)",
    },
    {
      name: "sleep",
      componentType: "numberInput",
      value: 50,
      label: "点击间隔时间(ms)",
    },
    {
      name: "button",
      componentType: "select",
      value: "left",
      label: "鼠标按键",
      options: [
        'left',
        'middle',
        'right',
      ],
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
