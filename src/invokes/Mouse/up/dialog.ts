export const dialogOptions = {
  title: "鼠标按键抬起",
  targetMethodName: "up",
  content: "鼠标移动到指定位置进行[左键/右键/中键]抬起，一般用于鼠标按键按下API调用之后主动抬起",
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
      label: "鼠标按键",
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
