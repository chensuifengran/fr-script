import { screenMatchTemplateFn } from "./exportFn";
import { modelCallback } from "./modelCallback";
import { apiDocument } from "./document";
import { dialogOptions } from "./dialog";
import { declaration } from "./declaration";
import { auxiliary } from "./auxiliary";

export const screenMatchTemplateApi = <InvokeApiMethodType>{
  name: "screenMatchTemplate",
  scope: "CV",
  exportFn: {
    fn: screenMatchTemplateFn,
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
