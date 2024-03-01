export const dialogOptions = {
  title: "输入字符串",
  targetMethodName: "text",
  content: "输入一串指定字符串",
  args: [
    {
      name: "text",
      componentType: "input",
      value: '',
      label: "输入的内容",
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
