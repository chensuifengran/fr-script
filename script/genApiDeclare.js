/**
 * @description 生成用于提供给编辑器的类型声明字符串
 * @author 尘随风染
 */
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { writeFileSync, readFileSync } from "fs";
import chalk from "chalk";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const typesDir = resolve(__dirname, "../src/types");
const invokesDir = resolve(__dirname, "../src/invokes");
const target = process.argv[2];
const syncBuildFormDeclare = ()=>{
  console.log("🚀", "开始同步buildForm的类型声明到编辑器");
  console.time(chalk.green("sync type use time"));
  const buildFormContent = readFileSync(
    resolve(typesDir, "buildForm.d.ts"),
    "utf-8"
  );
  const res = `export const BUILD_FORM_DECLARE = \`\n${buildFormContent.trim()}\n\``;
  writeFileSync(resolve(invokesDir, "buildFormDeclare.ts"), res);
  console.timeEnd(chalk.green("sync type use time"));
}
const syncRendererListDeclare = ()=>{
  console.log("🚀", "开始同步rendererList的类型声明到编辑器");
  console.time(chalk.green("sync type use time"));
  const rendererListContent = readFileSync(
    resolve(typesDir, "rendererList.d.ts"),
    "utf-8"
  );
  const res = `export const RENDERER_LIST_DECLARE = \`\n${rendererListContent.trim()}\n\``;
  writeFileSync(resolve(invokesDir, "rendererListDeclare.ts"), res);
  console.timeEnd(chalk.green("sync type use time"));
}
try {
  if (target === "buildForm") {
    syncBuildFormDeclare();
  } else if (target === "rendererList") {
    syncRendererListDeclare();
  } else{
    syncBuildFormDeclare();
    syncRendererListDeclare();
  }
} catch (error) {
  console.error("❌", error);
}
