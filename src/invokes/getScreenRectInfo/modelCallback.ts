import { getScreenRectInfoFn } from "./exportFn";
export const modelCallback = async (
  options: { delayTime: number },
  testModuleCtx: {
    showDetails: ShowDetailsFn;
  }
) => {
  console.time("getScreenRectInfo耗时");
  const rectInfo = await getScreenRectInfoFn(options.delayTime);
  console.timeEnd("getScreenRectInfo耗时");
  testModuleCtx.showDetails(
    `桌面截图标注矩形的起始点以及宽高：${JSON.stringify(rectInfo)}`,
    "getScreenRectInfo"
  );
};
