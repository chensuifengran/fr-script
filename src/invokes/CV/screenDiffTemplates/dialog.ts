export const dialogOptions = <TestModuleType["dialog"]>{
  title: "屏幕中多模板的位置差异匹配",
  targetMethodName: "screenDiffTemplates",
  content: `
      将屏幕指定范围进行截图与多模板图片进行位置差异对比
      `,
  args: [
    {
      name: "range",
      componentType: "rectInput",
      value: {
        x: -1,
        y: -1,
        width: -1,
        height: -1,
      },
      label: "截图范围",
    },
    {
      name: "tempPaths",
      componentType: "fileInput",
      multiple: true,
      value: [],
      label: "模板图片路径",
    },
    {
      name: "targetIndex",
      componentType: "numberInput",
      value: 0,
      label: "主模板图片索引, 其余模板会携带与主模板的位置差异",
    },
  ],
};
