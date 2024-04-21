import { getScreenSizeFn } from "./exportFn";


export const modelCallback = async (
  _options: undefined,
  //DllTest组件的上下文
  testModuleCtx: {
    showDetails: (text: string | undefined, preStr?: string) => void;
  }
) => {

  console.time("getScreenSize耗时");
  const { width, height } = await getScreenSizeFn();
  console.timeEnd("getScreenSize耗时");
  testModuleCtx.showDetails(
    "屏幕宽高：" + width + "x" + height,
    "getScreenSize"
  );
};
