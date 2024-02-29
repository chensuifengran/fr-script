export const dialogOptions = {
  title: "截图",
  targetMethodName: "screenshot",
  content:
    "屏幕截图，自定义截图区域时，x、y、width、height任意一个值为-1时，截取全屏幕",
  args: [
    {
      name: "path",
      componentType: "FileInput",
      value: "",
      label: "截图保存路径",
    },
    {
      name: "selectRange",
      componentType: "switch",
      value: false,
      label: "是否全屏截图",
      activeText: "自定义截图区域",
      inactiveText: "全屏截图",
    },
    {
      name: "range",
      componentType: "RectInput",
      targetSrc: "path",
      label: "截图区域",
      value: {
        x: -1,
        y: -1,
        width: -1,
        height: -1,
      },
      displayCondition: "selectRange",
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
