import { cropPictureFn } from "./exportFn";
import { modelCallback } from "./modelCallback";
import { apiDocument } from "./document";
import { dialogOptions } from "./dialog";
import { declaration } from "./declaration";
import { auxiliary } from "./auxiliary";

export const cropPictureApi = <InvokeApiMethodType>{
  name: "cropPicture",
  exportFn: {
    fn: cropPictureFn,
  },
  testModule: {
    weight: 2,
    callback: modelCallback,
    document: apiDocument,
    dialog: dialogOptions,
  },
  declaration,
  auxiliary
};
