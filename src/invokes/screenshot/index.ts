import { screenshotFn } from "./exportFn";
import { modelCallback } from "./modelCallbcak";
import { apiDocument } from "./document";
import { dialogOptions } from "./dialog";
import { declaration } from "./declaration";
import { auxiliary } from "./auxiliary";

export const screenshotApi = <InvokeApiMethodType>{
  name: "screenshot",
  exportFn: {
    fn: screenshotFn,
  },
  testModule: {
    weight: 5,
    callback: modelCallback,
    dialog: dialogOptions,
    document: apiDocument,
  },
  declaration,
  auxiliary
};
