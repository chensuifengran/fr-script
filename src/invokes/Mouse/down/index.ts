import { downFn } from "./exportFn";
import { modelCallback } from "./modelCallback";
import { apiDocument } from "./document";
import { dialogOptions } from "./dialog";
import { declaration } from "./declaration";
import { auxiliary } from "./auxiliary";

export const downApi = <InvokeApiMethodType>{
  name: "down",
  scope: "Mouse",
  exportFn: {
    fn: downFn,
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
