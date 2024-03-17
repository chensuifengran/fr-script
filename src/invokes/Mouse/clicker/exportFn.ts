import { invoke } from "@tauri-apps/api";

export const clickerFn = async (
  duration: number,
  sleep: number = 50,
  button: 'left' | 'right' | 'middle' = 'left',
  taskId?: string
) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return async ()=>{};
  }
  try {
    if (duration < 0) {
      duration = 0;
    }
    if (sleep < 0) {
      sleep = 0;
    }
    const allowButton = ['left', 'middle', 'right'];
    const buttonIndex = allowButton.indexOf(button);
    if(buttonIndex === -1){
      ElMessage.error('暂不支持的鼠标按键类型' + button);
      return async ()=>{};
    }
    await invoke("start_clicker", {
      duration,
      sleep,
      button: buttonIndex,
    });
    return async () => {
      await invoke("stop_clicker");
    };
  } catch (error) {
    console.error("clickFnError:", error);
    ElMessage.error('clickFnError:' + error);
  }
  return async ()=>{};
};
