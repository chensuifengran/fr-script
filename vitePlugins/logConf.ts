import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { writeFileSync, existsSync, readFileSync, mkdirSync } from "fs";
import chalk from "chalk";
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
export const changeLogLevel = (level: string = "DEBUG") => {
  if (
    level !== "DEBUG" &&
    level !== "INFO" &&
    level !== "WARN" &&
    level !== "ERROR"
  ) {
    console.log("❌ 日志级别设置错误，请检查输入是否正确");
    return;
  }
  const logYmlPath = resolve(__dirname, "../src-tauri/resources/log4rs.yml");
  const log4rsYml = LOG_4_RS_YML.replace("__LOG_LEVEL__", level);
  let needUpdate = true;
  if (existsSync(logYmlPath)) {
    const yml = readFileSync(logYmlPath, "utf-8");
    if (yml.trim() === log4rsYml.trim()) {
      needUpdate = false;
    }
  }
  if (needUpdate) {
    try {
      if (!existsSync(logYmlPath)) {
        mkdirSync(resolve(__dirname, "../src-tauri/resources"), {
          recursive: true,
        });
      }
      writeFileSync(logYmlPath, log4rsYml, {
        encoding: "utf-8",
      });
      console.log("✨ 日志级别已设置为：", chalk.yellow(level));
    } catch (error) {
      console.error("❌ 日志文件写入失败：", error);
    }
  }
  console.log(
    "当前环境：",
    chalk.green(level === "DEBUG" ? "development" : "production")
  );
};
