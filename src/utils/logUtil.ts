import { invoke } from "@tauri-apps/api/core";
import { nanoid } from "nanoid";
const isProduction = import.meta.env.PROD;
let isSetReport = false;
const setProductionErrorReport = () => {
  const oldConsoleProto = window.console;
  const newConsoleProto = Object.create(oldConsoleProto);
  newConsoleProto.error = function (...data: any[]) {
    const msg = data
      .map((d) => (typeof d === "string" ? d : JSON.stringify(d)))
      .join(" ");
    if (!IS_PLAYGROUND_ENV && isProduction && !isSetReport) {
      invoke("error_report", {
        msg,
      });
    }
    useLog().logOutput.push({
      id: "SYS-" + nanoid(),
      time: new Date(Date.now()).toLocaleTimeString(),
      log: msg,
      type: "danger",
      timestamp: Date.now(),
    });
    oldConsoleProto.error.call(this, ...data);
  };
  window.console = newConsoleProto;
  isSetReport = true;
};

const report = (msg: any) => {
  if (IS_PLAYGROUND_ENV) {
    return;
  }
  return invoke<void>("error_report", {
    msg: JSON.stringify(msg),
  });
};
const scriptConsoleErrorReport = (msg: string, name?: string) => {
  if (IS_PLAYGROUND_ENV) {
    return;
  }
  if (isProduction) {
    report(`[${name || "脚本控制台"}]${msg}`);
  }
};
export const logUtil = {
  setProductionErrorReport,
  scriptConsoleErrorReport,
  report,
};
