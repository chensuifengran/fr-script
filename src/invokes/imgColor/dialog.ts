export const dialogOptions = <TestModuleType['dialog']>{
  title: "获得图片指定坐标颜色",
  targetMethodName: "imgColor",
  content:
    "识别图片指定坐标颜色，返回颜色工具实例",
  args: [
    {
      name:'path',
      componentType: "FileInput",
      value: "",
      label: "图片路径",
    },
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
      name: "delay",
      componentType: "numberInput",
      value: 0,
      label: "延迟执行时间(ms)【仅测试】",
      onlyTest: true,
    },
  ],
};
