import { Plugin } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { exec } from "child_process";
import chalk from "chalk";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const scriptPath = resolve(__dirname, "../script/genBuiltInApiType.js");
let timer: any;
const runScript = (type: "api" | "declare") => {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    //使用node执行scriptPath脚本
    exec(`node ${scriptPath} ${type}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`执行错误: ${error}`);
        return;
      }
      //HH:mm:ss
      const date = new Date().toLocaleTimeString().slice(0, 8);
      if (stderr) {
        console.error(
          date,
          chalk.blue("[hot-update-plugin]"),
          chalk.red(stderr)
        );
      } else {
        console.log(
          date,
          chalk.blue("[hot-update-plugin]"),
          chalk.green(stdout)
        );
      }
    });
  }, 500);
};
const genDeclareScriptPath = resolve(__dirname, "../script/genApiDeclare.js");
let genApiDeclareTimer: any;
const getDeclareStr = (target: "buildForm" | "rendererList") => {
  genApiDeclareTimer && clearTimeout(genApiDeclareTimer);
  genApiDeclareTimer = setTimeout(() => {
    exec(`node ${genDeclareScriptPath} ${target}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`执行错误: ${error}`);
        return;
      }
      //HH:mm:ss
      const date = new Date().toLocaleTimeString().slice(0, 8);
      if (stderr) {
        console.error(
          date,
          chalk.blue("[hot-update-plugin]"),
          chalk.red(stderr)
        );
      } else {
        console.log(
          date,
          chalk.blue("[hot-update-plugin]"),
          chalk.green(stdout)
        );
      }
    });
  }, 500);
};
const getEnumsScriptPath = resolve(__dirname, "../script/genEnumDeclare.js");
const runGenEnums = () => {
  exec(`node ${getEnumsScriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行错误: ${error}`);
      return;
    }
    //HH:mm:ss
    const date = new Date().toLocaleTimeString().slice(0, 8);
    if (stderr) {
      console.error(date, chalk.blue("[hot-update-plugin]"), chalk.red(stderr));
    } else {
      console.log(date, chalk.blue("[hot-update-plugin]"), chalk.green(stdout));
    }
  });
};
export function hotUpdatePlugin(): Plugin {
  return {
    name: "hot-update-plugin",
    handleHotUpdate({ file }) {
      if (file.endsWith(".ts")) {
        const excludeFiles = [
          "builtInApi.d.ts",
          "core.d.ts",
          "buildFormDeclare.ts",
          "rendererListDeclare.ts",
          "enums.ts",
        ];
        if (excludeFiles.find((e) => file.includes(e))) {
          return;
        }
        if (file.includes("invokes/")) {
          runScript("api");
        }
        if (file.includes("useScriptApi.ts") || file.includes("useCore.ts")) {
          runScript("declare");
        }
        if (file.includes("buildForm.d.ts")) {
          getDeclareStr("buildForm");
        } else if (file.includes("rendererList.d.ts")) {
          getDeclareStr("rendererList");
        } else if (file.includes("enums.d.ts")) {
          runGenEnums();
        }
      }
    },
  };
}
