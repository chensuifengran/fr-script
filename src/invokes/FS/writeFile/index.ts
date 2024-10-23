import { apiDocument } from "./document";
import { writeFileFn } from "./exportFn";
import { modelCallback } from "./modelCallback";
import { dialogOptions } from "./dialog";
import { declaration } from "./declaration";
import { auxiliary } from "./auxiliary";
export const writeFileApi = <InvokeApiMethodType>{
  scope: 'FS',
  name: "writeFile",
  exportFn: {
    fn: writeFileFn,
  },
  testModule: {
    weight: 5,
    dialog: dialogOptions,
    callback: modelCallback,
    document: apiDocument,
  },
  //提供给编辑器的类型声明
  declaration,
  //编辑-快速填写或修改方法参数 辅助模块
  auxiliary
};