export const dialogOptions = {
  title: "将鼠标移动到指定位置并产生随机偏移",
  targetMethodName: "randomMove",
  content: "输入指定位置的x、y坐标，xRandomRange和yRandomRange可以让该坐标随机产生一定程度偏移",
  args: [
    {
      name: "x",
      componentType: "numberInput",
      label: "目标位置x坐标",
      value: 0,
    },
    {
      name: "y",
      componentType: "numberInput",
      label: "目标位置y坐标",
      value: 0,
    },
    {
      name: "xRandomRange",
      componentType: "numberRangeInput",
      label: "x轴随机偏移范围",
      value: [0,0],
    },
    {
      name: "yRandomRange",
      componentType: "numberRangeInput",
      label: "y轴随机偏移范围",
      value: [0,0],
    }
  ],
};
