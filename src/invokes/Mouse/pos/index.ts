import { posFn } from "./exportFn";
import { modelCallback } from "./modelCallbcak";
import { dialogOptions } from "./dialog";
import { apiDocument } from "./document";
import { declaration } from "./declaration";
export const posApi = <InvokeApiMethodType>{
  name: "pos",
  scope: "Mouse",
  exportFn: {
    fn: posFn,
  },
  testModule: {
    weight: 1,
    //弹窗点击确定后调用的方法
    callback: modelCallback,
    //弹窗配置
    dialog: dialogOptions,
    document: apiDocument,
  },
  declaration
};
