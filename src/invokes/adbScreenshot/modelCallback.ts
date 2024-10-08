import { adbScreenshotFn } from "./exportFn";

export const modelCallback = async (
  _options: undefined,
  testModuleCtx: {
    showDetails: ShowDetailsFn;
  }
) => {
  const res = await adbScreenshotFn();
  testModuleCtx.showDetails(res);
};
