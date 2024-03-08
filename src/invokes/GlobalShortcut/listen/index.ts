import { listenFn } from "./exportFn";
import { modelCallback } from "./modelCallbcak";
import { apiDocument } from "./document";
import { declaration } from "./declaration";

export const listenApi = <InvokeApiMethodType>{
  name: "listen",
  scope: "GlobalShortcut",
  exportFn: {
    fn: listenFn,
  },
  testModule: {
    weight: 4,
    dialog: {
      notOpen: true,
      title: "监听快捷键触发",
      targetMethodName: "listen",
    },
    callback: modelCallback,
    document: apiDocument,
  },
  declaration,
};
