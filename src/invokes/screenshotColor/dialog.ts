export const dialogOptions = <TestModuleType['dialog']>{
  title: "识别[屏幕/ADB设备]截图指定坐标颜色",
  targetMethodName: "screenshotColor",
  content:
    "识别[屏幕/ADB设备]截图指定坐标颜色，返回颜色工具实例",
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
      name: "mod",
      componentType: "select",
      value: "normal",
      label: "截图模式",
      options: ["normal", "adb"],
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
