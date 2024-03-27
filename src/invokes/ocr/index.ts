import { apiDocument } from "./document";
import { ocrFn } from "./exportFn";
import { modelCallback } from "./modelCallback";
import { dialogOptions } from "./dialog";
import { declaration } from "./declaration";
import { auxiliary } from "./auxiliary";
import { FindResult, OcrUtil } from "./OcrUtil";

export const ocrApi = <InvokeApiMethodType>{
  name: "ocr",
  exportFn: {
    fn: ocrFn,
  },
  testModule: {
    weight: 5,
    dialog: dialogOptions,
    callback: modelCallback,
    document: apiDocument,
  },
  declaration,
  auxiliary,
  helperClass:[OcrUtil, FindResult]
};
