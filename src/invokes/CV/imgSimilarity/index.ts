import { imgSimilarityFn } from "./exportFn";
import { modelCallback } from "./modelCallback";
import { apiDocument } from "./document";
import { dialogOptions } from "./dialog";
import { declaration } from "./declaration";
import { auxiliary } from "./auxiliary";

export const imgSimilarityApi = <InvokeApiMethodType>{
  name: "imgSimilarity",
  scope: "CV",
  exportFn: {
    fn: imgSimilarityFn,
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