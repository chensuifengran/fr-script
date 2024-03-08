export const modelCallback = async (
  _options: undefined,
  testModuleCtx: {
    showDetails: (text: string | undefined, preStr?: string) => void;
  }
) => {
  testModuleCtx.showDetails('此方法无法直接调用，请在脚本中使用！','GlobalShortcut.unlisten')
};
