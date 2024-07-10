import { auxiliary } from "./auxiliary";
import { declaration } from "./declaration";
import { dialogOptions } from "./dialog";
import { apiDocument } from "./document";
import { sleepFn } from "./exportFn";
import { modelCallback } from "./modelCallback";

export const sleepApi = <InvokeApiMethodType>{
  name: "sleep",
  scope: "Preludes",
  exportFn: {
    fn: sleepFn,
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
