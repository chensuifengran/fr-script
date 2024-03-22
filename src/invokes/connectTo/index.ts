import { dialogOptions } from "./dialog";
import { apiDocument } from "./document";
import { connectToFn } from "./exportFn";
import { modelCallback } from "./modelCallback";
import { declaration } from "./declaration";
import { auxiliary } from "./auxiliary";
export const connectToApi = <InvokeApiMethodType>{
  name: "connectTo",
  exportFn: {
    fn: connectToFn,
  },
  testModule: {
    weight: 3,
    dialog: dialogOptions,
    callback: modelCallback,
    document: apiDocument,
  },
  declaration,
  auxiliary,
}
export const connectToApiDeclaration = declaration;
