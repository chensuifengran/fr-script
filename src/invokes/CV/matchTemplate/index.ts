import { matchTemplateFn } from "./exportFn";
import { modelCallback } from "./modelCallbcak";
import { apiDocument } from "./document";
import { dialogOptions } from "./dialog";
import { declaration } from "./declaration";
import { auxiliary } from "./auxiliary";
import { MatchUtil } from "./MatchUtil";

export const matchTemplateApi = <InvokeApiMethodType>{
  name: "matchTemplate",
  scope: "CV",
  exportFn: {
    fn: matchTemplateFn,
  },
  testModule: {
    weight: 5,
    dialog: dialogOptions,
    callback: modelCallback,
    document: apiDocument,
  },
  declaration,
  auxiliary,
  helperClass:[MatchUtil]
};
