import { clickHomeKeyFn } from "./exportFn";
import { modelCallback } from "./modelCallback";
import { apiDocument } from "./document";
import { declaration } from "./declaration";

// 定义一个函数，返回一个符合 ADBMethodType 接口的对象
export const clickHomeKeyApi = <InvokeApiMethodType>{
  scope:"ADB",
  // 定义方法的名称
  name: "clickHomeKey",
  // 定义将要导出的函数
  exportFn: {
    fn: clickHomeKeyFn,
  },
  // 定义方法的测试模型
  testModule: {
    weight: 1,
    dialog: {
      notOpen: true,
      title: "点击Home键",
      targetMethodName: "clickHomeKey",
    },
    callback: modelCallback,
    document: apiDocument,
  },
  declaration,
};
