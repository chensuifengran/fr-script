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
const gen = (declare) => `export const ENUM_DECLARE = \`
${declare}
\`;
export const ENUM_CODE = ENUM_DECLARE.replace(/declare enum/g, "enum");`;
const outputName = "enums.ts";
try {
  console.time(chalk.green("gen declare use time"));
  const enumContent = readFileSync(resolve(typesDir, "enums.d.ts"), "utf-8");
  const res = gen(enumContent.trim());
  writeFileSync(resolve(invokesDir, outputName), res);
  console.log("🚀", `开始同步enums.d.ts的内容到${outputName}`);
  console.timeEnd(chalk.green("gen declare use time"));
} catch (e) {
  console.error("❌", e);
}
