import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { readdirSync } from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const invokesPath = resolve(__dirname, "../invokes");
import { writeFileSync } from "fs";
try {
  console.time("generate use time")
  const dirs = readdirSync(invokesPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  let content = "export type InvokeApiType = {\n";
  dirs.forEach((dir) => {
    const dirPath = resolve(invokesPath, dir);
    const files = readdirSync(dirPath);
    if (files.includes("index.ts")) {
      content += `  ${dir}: typeof import('./${dir}/exportFn')["${dir}Fn"],\n`;
    } else {
      const subDirs = readdirSync(dirPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
      content += `  ${dir}: {\n`;
      subDirs.forEach((subDir) => {
        content += `    ${subDir}: typeof import('./${dir}/${subDir}/exportFn')["${subDir}Fn"],\n`;
      });
      content += "  },\n";
    }
  });
  content += "};\n";
  writeFileSync(resolve(invokesPath, "InvokeApiType.ts"), content);
  console.log(
    "✨","generate InvokeApiType.ts file in",
    invokesPath + "\\InvokeApiType.ts"
  );
  console.timeEnd("generate use time")
} catch (error) {
  console.error("生成InvokeApiType.ts文件失败", error);
}