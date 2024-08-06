
import { getScreenSizeFn } from "./exportFn";
import { modelCallback } from "./modelCallback";
import { dialogOptions } from "./dialog";
import { apiDocument } from "./document";
import { declaration } from "./declaration";

export const getScreenSizeApi = <InvokeApiMethodType>{
  name: "getScreenSize",
  exportFn: {
    fn: getScreenSizeFn,
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
