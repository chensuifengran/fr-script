import { auxiliary } from "./auxiliary";
import { declaration } from "./declaration";
import { dialogOptions } from "./dialog";
import { apiDocument } from "./document";
import { logFn } from "./exportFn";
import { modelCallback } from "./modelCallback";

export const logApi = <InvokeApiMethodType>{
  name: "log",
  scope: "Preludes",
  exportFn: {
    fn: logFn,
  },
  testModule: {
    weight: 1,
    dialog: dialogOptions,
    document: apiDocument,
    callback: modelCallback,
  },
  declaration,
  auxiliary,
};
