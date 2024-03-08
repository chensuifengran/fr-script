import { waitKeysFn } from "./exportFn";
import { modelCallback } from "./modelCallbcak";
import { apiDocument } from "./document";
import { dialogOptions } from "./dialog";
import { declaration } from "./declaration";
import { auxiliary } from "./auxiliary";

export const waitKeysApi = <InvokeApiMethodType>{
  name: "waitKeys",
  scope: "GlobalShortcut",
  exportFn: {
    fn: waitKeysFn,
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
