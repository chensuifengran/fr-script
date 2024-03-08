export const dialogOptions = {
  title: "等待快捷键触发",
  targetMethodName: "waitKeys",
  content: "等待快捷键触发, 返回触发的快捷键名称, 若快捷键冲突则返回undefined",
  args: [
    {
      name: "keys",
      componentType: "select",
      value: [],
      label: "等待触发的按键(可多选创建)",
      options: [
        "Alt+S","Alt+E"
      ], 
      multiple: true,
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
