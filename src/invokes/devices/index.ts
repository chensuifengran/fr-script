import { devicesFn } from "./exportFn";
import { modelCallback } from "./modelCallback";
import { apiDocument } from "./document";
import { declaration } from "./declaration";

export const devicesApi = <InvokeApiMethodType>{
  name: "devices",
  exportFn: {
    fn: devicesFn,
  },
  testModule: {
    weight: 2,
    dialog: {
      notOpen: true,
      title: "获取ADB设备列表",
      targetMethodName: "devices",
    },
    callback: modelCallback,
    document: apiDocument,
  },
  declaration
};
