
import { getImageSizeFn } from "./exportFn";
import { modelCallback } from "./modelCallbcak";
import { dialogOptions } from "./dialog";
import { apiDocument } from "./document";
import { declaration } from "./declaration";
import { auxiliary } from "./auxiliary";

export const getImageSizeApi = <InvokeApiMethodType>{
  name: "getImageSize",
  exportFn: {
    fn: getImageSizeFn,
  },
  testModule: {
    weight: 1,
    //弹窗点击确定后调用的方法
    callback: modelCallback,
    //弹窗配置
    dialog: dialogOptions,
    document: apiDocument,
  },
  declaration,
  auxiliary
};
