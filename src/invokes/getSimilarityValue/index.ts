import { getSimilarityValueFn } from "./exportFn";
import { modelCallback } from "./modelCallbcak";
import { apiDocument } from "./document";
import { dialogOptions } from "./dialog";
import { declaration } from "./declaration";
import { auxiliary } from "./auxiliary";

export const getSimilarityValueApi = <InvokeApiMethodType>{
  name: "getSimilarityValue",
  exportFn: {
    fn: getSimilarityValueFn,
  },
  testModule: {
    weight: 4,
    dialog: dialogOptions,
    callback: modelCallback,
    document: apiDocument,
  },
  declaration,
  auxiliary
}