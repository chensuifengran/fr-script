export const dialogOptions = {
  title: "鼠标点击",
  targetMethodName: "click",
  content: "鼠标移动到指定位置进行[左键/中键/右键]点击",
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
      name: "button",
      componentType: "select",
      value: 'left',
      notAllowCreate: true,
      label: "左键/右键",
      options: ["left", "right", "middle"], 
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
