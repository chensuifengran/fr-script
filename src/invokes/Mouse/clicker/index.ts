import { clickerFn } from "./exportFn";
import { modelCallback } from "./modelCallbcak";
import { apiDocument } from "./document";
import { dialogOptions } from "./dialog";
import { declaration } from "./declaration";
import { auxiliary } from "./auxiliary";

export const clickerApi = <InvokeApiMethodType>{
  name: "clicker",
  scope: "Mouse",
  exportFn: {
    fn: clickerFn,
  },
  testModule: {
    weight: 4,
    dialog: dialogOptions,
    callback: modelCallback,
    document: apiDocument,
  },
  declaration,
  auxiliary
};
