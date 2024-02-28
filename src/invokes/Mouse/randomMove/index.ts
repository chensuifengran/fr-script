import { randomMoveFn } from "./exportFn";
import { dialogOptions } from "./dialog";
import { modelCallback } from "./modelCallback";
import { apiDocument } from "./document";
import { declaration } from "./declaration";
import { auxiliary } from "./auxiliary";

export const randomMoveApi = <InvokeApiMethodType>{
  name: "randomMove",
  scope: "Mouse",
  exportFn: {
    fn: randomMoveFn,
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
