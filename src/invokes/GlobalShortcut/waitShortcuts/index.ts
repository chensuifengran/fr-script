import { waitShortcutsFn } from "./exportFn";
import { modelCallback } from "./modelCallback";
import { apiDocument } from "./document";
import { dialogOptions } from "./dialog";
import { declaration } from "./declaration";
import { auxiliary } from "./auxiliary";

export const waitShortcutsApi = <InvokeApiMethodType>{
  name: "waitShortcuts",
  scope: "GlobalShortcut",
  exportFn: {
    fn: waitShortcutsFn,
  },
  testModule: {
    weight: 4,
    dialog: dialogOptions,
    callback: modelCallback,
    document: apiDocument,
  },
  declaration,
  auxiliary
};
