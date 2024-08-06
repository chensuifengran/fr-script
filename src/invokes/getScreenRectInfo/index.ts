import { getScreenRectInfoFn } from "./exportFn";
import { modelCallback } from "./modelCallback";
import { apiDocument } from "./document";
import { dialogOptions } from "./dialog";
import { declaration } from "./declaration";

export const getScreenRectInfoApi = <InvokeApiMethodType>{
  name: "getScreenRectInfo",
  exportFn: {
    fn: getScreenRectInfoFn,
  },
  testModule: {
    weight: 3,
    callback: modelCallback,
    dialog: dialogOptions,
    document: apiDocument,
  },
  declaration
};
