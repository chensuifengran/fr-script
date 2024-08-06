import { screenColorFn } from "./exportFn";
import { modelCallback } from "./modelCallback";
import { apiDocument } from "./document";
import { dialogOptions } from "./dialog";
import { declaration } from "./declaration";
import { auxiliary } from "./auxiliary";
import { ColorUtil } from "./ColorUtil";

export const screenColorApi = <InvokeApiMethodType>{
  name: "screenColor",
  exportFn: {
    fn: screenColorFn,
  },
  testModule: {
    weight: 5,
    callback: modelCallback,
    dialog: dialogOptions,
    document: apiDocument,
  },
  declaration,
  auxiliary,
  helperClass:[ColorUtil]
};