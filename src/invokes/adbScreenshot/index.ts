
import { apiDocument } from "./document";
import { adbScreenshot } from "./exportFn";
import { modelCallback } from "./modelCallback";
import { declaration } from "./declaration";

export const adbScreenshotApi = <InvokeApiMethodType>{
  name: "adbScreenshot",
  exportFn: {
    fn: adbScreenshot,
  },
  testModule: {
    weight: 3,
    dialog: {
      notOpen: true,
      title: "截图",
      targetMethodName: "adbScreenshot",
    },
    callback: modelCallback,
    document: apiDocument,
  },
  declaration
};
