import { Plugin } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { exec } from "child_process";
import chalk from "chalk";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const scriptPath = resolve(__dirname, "../script/genInvokeFnType.js");
let timer: any;
const runScript = () => {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    //使用node执行scriptPath脚本
    exec(`node ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`执行错误: ${error}`);
        return;
      }
      //HH:mm:ss
      const date = new Date().toLocaleTimeString().slice(0, 8);
      if(stderr){
        console.error(date, chalk.blue("[hot-update-plugin]"), chalk.red(stderr));
      }else{
        console.log(date, chalk.blue("[hot-update-plugin]"), chalk.green(stdout));
      }
    });
  }, 500);
};
export function hotUpdatePlugin(): Plugin {
  return {
    name: "hot-update-plugin",
    handleHotUpdate({ file }) {
      if (file.endsWith(".ts")) {
        if (file.includes("InvokeApiType.ts") || !file.includes("invokes/")) {
          return;
        }
        runScript();
      }
    },
  };
}
