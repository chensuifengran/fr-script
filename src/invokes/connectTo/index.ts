import { dialogOptions } from "./dialog";
import { apiDocument } from "./document";
import { connectToFn } from "./exportFn";
import { modelCallback } from "./modelCallback";
import { declaration } from "./declaration";
import { auxiliary } from "./auxiliary";
import { ListStore } from "../../store/listStore";
export const connectToApi = (listStore: ListStore) => {
  return <InvokeApiMethodType>{
    
    name: "connectTo",
    exportFn: {
      fn: connectToFn,
    },
    testModule: {
      weight: 3,
      dialog: dialogOptions(listStore),
      callback: modelCallback,
      document: apiDocument,
    },
    declaration,
    auxiliary,
  };
};
export const connectToApiDeclaration = declaration;
