import { clickHomeKeyFn } from "./exportFn";

export const modelCallback = async (
  _options: undefined,
  testModuleCtx: {
    showDetails: ShowDetailsFn;
  }
) => {
  const res = await clickHomeKeyFn();
  testModuleCtx.showDetails(res);
};
