import { screenDiffTemplatesFn } from "./exportFn";
import { modelCallback } from "./modelCallbcak";
import { apiDocument } from "./document";
import { dialogOptions } from "./dialog";
import { declaration } from "./declaration";
import { auxiliary } from "./auxiliary";

export const screenDiffTemplatesApi = <InvokeApiMethodType>{
  name: "screenDiffTemplates",
  scope: "CV",
  exportFn: {
    fn: screenDiffTemplatesFn,
  },
  testModule: {
    weight: 5,
    dialog: dialogOptions,
    callback: modelCallback,
    document: apiDocument,
  },
  declaration,
  auxiliary
};
