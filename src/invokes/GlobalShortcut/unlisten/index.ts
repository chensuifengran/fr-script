import { unlistenFn } from "./exportFn";
import { modelCallback } from "./modelCallbcak";
import { apiDocument } from "./document";
import { declaration } from "./declaration";

export const unlistenApi = <InvokeApiMethodType>{
  name: "unlisten",
  scope: "GlobalShortcut",
  exportFn: {
    fn: unlistenFn,
  },
  testModule: {
    weight: 4,
    dialog: {
      notOpen: true,
      title: "取消监听快捷键触发",
      targetMethodName: "unlisten",
    },
    callback: modelCallback,
    document: apiDocument,
  },
  declaration,
};
