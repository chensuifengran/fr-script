import { dialogOptions } from "./dialog";
import { apiDocument } from "./document";
import { disConnectToFn } from "./exportFn";
import { modelCallback } from "./modelCallback";
import { declaration } from "./declaration";
import { auxiliary } from "./auxiliary";
import { ListStore } from "../../store/listStore";

export const disConnectToApi = (store: ListStore) => {
  return <InvokeApiMethodType>{
    name: "disConnectTo",
    exportFn: {
      fn: disConnectToFn,
    },
    testModule: {
      weight: 3,
      dialog: dialogOptions(store),
      callback: modelCallback,
      document: apiDocument,
    },
    declaration,
    auxiliary
  };
};

export const disConnectToApiDeclaration = declaration;