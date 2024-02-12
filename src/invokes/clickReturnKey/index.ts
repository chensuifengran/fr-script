import { clickReturnKeyFn } from "./exportFn";
import { modelCallback } from "./modelCallback";
import { apiDocument } from "./document";
import { declaration } from "./declaration";
export const clickReturnKeyApi = <InvokeApiMethodType>{
  name: "clickReturnKey",
  exportFn: {
    fn: clickReturnKeyFn,
  },
  testModule: {
    weight: 1,
    dialog: {
      notOpen: true,
      title: "点击返回键",
      targetMethodName: "clickReturnKey",
    },
    callback: modelCallback,
    document: apiDocument,
  },
  declaration
};
