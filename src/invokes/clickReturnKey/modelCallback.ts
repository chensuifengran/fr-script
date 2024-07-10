import { clickReturnKeyFn } from "./exportFn";

export const modelCallback = async (
  _options: undefined,
  testModuleCtx: {
    showDetails: ShowDetailsFn;
  }
) => {
  const res = await clickReturnKeyFn();
  testModuleCtx.showDetails(res);
};
