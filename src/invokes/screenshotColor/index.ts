import { screenshotColorFn } from "./exportFn";
import { modelCallback } from "./modelCallback";
import { apiDocument } from "./document";
import { dialogOptions } from "./dialog";
import { declaration } from "./declaration";
import { auxiliary } from "./auxiliary";

export const screenshotColorApi = <InvokeApiMethodType>{
  name: "screenshotColor",
  exportFn: {
    fn: screenshotColorFn,
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