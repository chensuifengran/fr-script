import { invoke } from "@tauri-apps/api";
import p from "../../package.json";
const isProduction = p.env === "production";
let isSetReport = false;
const setProductionErrorReport = () => {
  if (isProduction && !isSetReport) {
    const oldConsoleProto = window.console;
    const newConsoleProto = Object.create(oldConsoleProto);
    newConsoleProto.error = function (...data: any[]) {
      data.forEach((d) => {
        invoke("error_report", {
          msg: d,
        });
      });
      oldConsoleProto.error.call(this, ...data);
    };
    window.console = newConsoleProto;
    isSetReport = true;
  }
};
const scriptConsoleErrorReport = (msg: string, name?: string) => {
  if (isProduction) {
    invoke("error_report", {
      msg: `[${name || "脚本控制台"}]${msg}`,
    });
  }
};
const report = (msg: any) => {
  return invoke<void>("error_report", {
    msg: JSON.stringify(msg),
  });
};
export const logUtil = {
  setProductionErrorReport,
  scriptConsoleErrorReport,
  report,
};
