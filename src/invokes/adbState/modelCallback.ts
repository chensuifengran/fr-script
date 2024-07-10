import { adbStateFn } from "./exportFn";

export const modelCallback = async (
  _options: undefined,
  testModuleCtx: {
    showDetails: ShowDetailsFn;
  }
) => {
  const res = await adbStateFn();
  testModuleCtx.showDetails(res);
};
