import { setMouseOptionFn } from "./exportFn";
import { modelCallback } from "./modelCallback";
import { apiDocument } from "./document";
import { declaration } from "./declaration";

export const setMouseOptionApi = <InvokeApiMethodType>{
  name: "setMouseOption",
  scope: "Mouse",
  exportFn: {
    fn: setMouseOptionFn,
  },
  testModule: {
    weight: 4,
    dialog: {
      notOpen: true,
      title: "设置鼠标模块配置",
      targetMethodName: "setMouseOption",
    },
    callback: modelCallback,
    document: apiDocument,
  },
  declaration,
};
