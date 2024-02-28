
import { adbStateFn } from "./exportFn";
import { modelCallback } from "./modelCallback";
import { apiDocument } from "./document";
import { declaration } from "./declaration";

export const adbStateApi = <InvokeApiMethodType>{
  name: "adbState",
  exportFn: {
    fn: adbStateFn,
  },
  testModule: {
    weight: 1,
    dialog: {
      notOpen: true,
      title: "获取设备状态",
      targetMethodName: "adbState",
    },
    callback: modelCallback,
    document: apiDocument,
  },
  declaration
};