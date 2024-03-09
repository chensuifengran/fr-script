import { cmdFn } from "./exportFn";
import { dialogOptions } from "./dialog";
import { modelCallback } from "./modelCallback";
import { apiDocument } from "./document";
import { declaration } from "./declaration";
import { auxiliary } from "./auxiliary";
export const cmdApi = <InvokeApiMethodType>{
  name: "cmd",
  exportFn: {
    fn: cmdFn,
  },
  testModule: {
    weight: 3,
    dialog: dialogOptions,
    callback: modelCallback,
    document: apiDocument,
  },
  declaration,
  auxiliary
};
