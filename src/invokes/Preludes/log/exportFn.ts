import { nanoid } from "nanoid";
import { getFileInfo } from "../../../hooks/useScriptApi";
import { useLog } from "../../../hooks/useLog";
const { logOutput } = useLog();
const { controlDeviceInfo } = useControl();
export const logFn = (
  _msg: any,
  type?: "success" | "danger" | "info" | "warning" | "loading",
  taskId?: string,
  force: boolean = false
) => {
  const { notAllowedFnId } = useScriptRuntime();
  const { taskRunStatus } = useScriptView();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return false;
  }
  if (!force && taskRunStatus.value === "done") {
    return;
  }
  const date = new Date(Date.now());
  //获取时分秒，时分秒不足两位补0
  const timeStr = [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((i) => {
      return i < 10 ? "0" + i : i;
    })
    .join(":");
  const msg = typeof _msg === "string" ? _msg : JSON.stringify(_msg);
  logOutput.push({
    id: nanoid(),
    time: timeStr,
    log: msg,
    type: type ? type : "info",
    timestamp: Date.now(),
  });
  if (controlDeviceInfo.executeScript === "execute") {
    useWss().syncLog(msg, timeStr, type ? type : "info");
  }
  if (!IS_PLAYGROUND_ENV) {
    const { notify } = eventUtil;
    notify.send({
      type,
      message: msg,
      time: timeStr,
    });
  }
  if (type === "danger") {
    const name = getFileInfo("name");
    const version = getFileInfo("version");
    logUtil.scriptConsoleErrorReport(msg, name + version);
  }
  const consoleLogDiv = document.getElementById("consoleLogDiv");
  consoleLogDiv &&
    (consoleLogDiv.scrollTop = consoleLogDiv?.scrollHeight + 9999);
};
