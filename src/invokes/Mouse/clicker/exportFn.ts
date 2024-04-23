const VOID_CB = async () => false;
export const clickerFn = async (
  duration: number,
  sleep: number = 50,
  button: "left" | "right" | "middle" = "left",
  taskId?: string
) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return VOID_CB;
  }
  try {
    if (duration < 0) {
      duration = 0;
    }
    if (sleep < 0) {
      sleep = 0;
    }
    const allowButton = ["left", "middle", "right"];
    const buttonIndex = allowButton.indexOf(button);
    if (buttonIndex === -1) {
      ElMessage.error("暂不支持的鼠标按键类型" + button);
      return VOID_CB;
    }
    const res = await invokeBaseApi.startClicker(duration, sleep, buttonIndex);
    if (res) {
      return async () => {
        const res = await invokeBaseApi.stopClicker();
        return res;
      };
    } else {
      return VOID_CB;
    }
  } catch (error) {
    console.error("clickFnError:", error);
    ElMessage.error("clickFnError:" + error);
  }
  return VOID_CB;
};
