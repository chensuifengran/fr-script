import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { writeFileSync } from "fs";
const LOG_4_RS_YML = `
refresh_rate: 30 seconds
appenders:
  stdout:
    kind: console
  rolling_file:
    kind: rolling_file
    path: "logs/application-errors.log"
    policy:
      kind: compound
      trigger:
        kind: size
        limit: 10000000
      roller:
        kind: delete
    encoder:
      pattern: "{d(%Y-%m-%d %H:%M:%S%.3f)} {M}: {m}{n}"
root:
  level: __LOG_LEVEL__
  appenders:
    - stdout
    - rolling_file
`;
//解析控制台参数
const level = process.argv[2] || "DEBUG";
if (
  level !== "DEBUG" &&
  level !== "INFO" &&
  level !== "WARN" &&
  level !== "ERROR"
) {
  console.error("参数错误，只能是DEBUG、INFO、WARN、ERROR中的一个");
  process.exit(1);
}
const log4rsYml = LOG_4_RS_YML.replace("__LOG_LEVEL__", level);
writeFileSync(
  resolve(__dirname, "../src-tauri/resources/log4rs.yml"),
  log4rsYml,
  {
    encoding: "utf-8",
  }
);
console.log(
  "✨ 日志级别已设置为：" + level,
  "当前环境：",
  level === "DEBUG" ? "development" : "production"
);
