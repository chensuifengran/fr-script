export const declaration = `
declare type MouseOption = {
  randomOffset?: [
    //随机偏移量
    [number, number], //x坐标偏移量[最小值,最大值]
    [number, number] //y坐标偏移量[最小值,最大值]
  ];
  baseSize?: [number, number]; //基准屏幕像素
};
function setMouseOption(
  option: MouseOption,
):void;
`