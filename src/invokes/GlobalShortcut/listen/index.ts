import { listenFn } from "./exportFn";
import { apiDocument } from "./document";
import { declaration } from "./declaration";

export const listenApi = <InvokeApiMethodType>{
  name: "listen",
  scope: "GlobalShortcut",
  exportFn: {
    fn: listenFn,
  },
  testModule: {
    weight: 4,
    dialog: {
      notOpen: true,
      title: "监听快捷键触发",
      targetMethodName: "listen",
    },
    callback: (
      _: undefined,
      testModuleCtx: {
        showDetails: ShowDetailsFn;
      }
    ) => {
      testModuleCtx.showDetails(
        "此方法无法直接调用，请在脚本中使用！",
        "GlobalShortcut.listen"
      );
    },
    document: apiDocument,
  },
  declaration,
};
