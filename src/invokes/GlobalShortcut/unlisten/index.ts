import { unlistenFn } from "./exportFn";
import { apiDocument } from "./document";
import { declaration } from "./declaration";

export const unlistenApi = <InvokeApiMethodType>{
  name: "unlisten",
  scope: "GlobalShortcut",
  exportFn: {
    fn: unlistenFn,
  },
  testModule: {
    weight: 4,
    dialog: {
      notOpen: true,
      title: "取消监听快捷键触发",
      targetMethodName: "unlisten",
    },
    callback: (
      _: undefined,
      testModuleCtx: {
        showDetails: ShowDetailsFn;
      }
    ) => {
      testModuleCtx.showDetails(
        "此方法无法直接调用，请在脚本中使用！",
        "GlobalShortcut.unlisten"
      );
    },
    document: apiDocument,
  },
  declaration,
};
