import { moveToFn } from "./exportFn";
import { dialogOptions } from "./dialog";
import { modelCallback } from "./modelCallback";
import { apiDocument } from "./document";
import { declaration } from "./declaration";
import { auxiliary } from "./auxiliary";

export const moveToApi = <InvokeApiMethodType>{
  name: "moveTo",
  exportFn: {
    fn: moveToFn,
  },
  testModule: {
    weight: 2,
    dialog: dialogOptions,
    callback: modelCallback,
    document: apiDocument,
  },
  declaration,
  auxiliary
};
