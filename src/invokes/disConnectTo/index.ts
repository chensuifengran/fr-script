import { dialogOptions } from "./dialog";
import { apiDocument } from "./document";
import { disConnectToFn } from "./exportFn";
import { modelCallback } from "./modelCallback";
import { declaration } from "./declaration";
import { auxiliary } from "./auxiliary";

export const disConnectToApi = <InvokeApiMethodType>{
  name: "disConnectTo",
  exportFn: {
    fn: disConnectToFn,
  },
  testModule: {
    weight: 3,
    dialog: dialogOptions,
    callback: modelCallback,
    document: apiDocument,
  },
  declaration,
  auxiliary
}

export const disConnectToApiDeclaration = declaration;