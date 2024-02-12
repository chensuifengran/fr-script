import { clickReturnKeyFn } from "./exportFn";

export const modelCallback = async (
  _options: undefined,
  testModuleCtx: {
    showDetails: (text: string | undefined, preStr?: string) => void;
  }
) => {
  const res = await clickReturnKeyFn();
  testModuleCtx.showDetails(res);
};
