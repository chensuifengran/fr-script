import { posFn } from "./exportFn";

export const modelCallback = async (
  _options: undefined,
  testModuleCtx: {
    showDetails: (text: string | undefined, preStr?: string) => void;
  }
) => {
  console.time("Mouse.pos耗时");
  const {x,y} = await posFn();
  console.log(x,y);
  
  console.timeEnd("Mouse.pos耗时");
  testModuleCtx.showDetails(`鼠标位置：${x},${y}`);
};
