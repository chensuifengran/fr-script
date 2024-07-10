export const modelCallback = async (
  _options: undefined,
  testModuleCtx: {
    showDetails: ShowDetailsFn;
  }
) => {
  testModuleCtx.showDetails('此方法无法直接调用，请在脚本中使用！','Mouse.setMouseOption')
};
