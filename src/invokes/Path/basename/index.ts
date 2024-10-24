import { apiDocument } from "./document";
import { basenameFn } from "./exportFn";
import { modelCallback } from "./modelCallback";
import { dialogOptions } from "./dialog";
import { declaration } from "./declaration";
import { auxiliary } from "./auxiliary";
export const basenameApi = <InvokeApiMethodType>{
  scope: "Path",
  name: "basename",
  exportFn: {
    fn: basenameFn,
  },
  testModule: {
    weight: 4,
    dialog: dialogOptions,
    callback: modelCallback,
    document: apiDocument,
  },
  //提供给编辑器的类型声明
  declaration,
  //编辑-快速填写或修改方法参数 辅助模块
  auxiliary,
};
