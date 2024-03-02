import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { readdirSync } from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const invokesPath = resolve(__dirname, "../invokes");
import { writeFileSync } from "fs";
/*
遍历invokes目录下的所有文件夹，如果文件夹下有index.ts文件，则此文件夹为一个invoke函数
如果没有，此文件夹为一个namespace，其子文件夹为invoke函数
invoke函数的类型定义在exportFn.ts导出的类型，类型命名为[name]Fn，name为文件夹名
生成一个文件，文件存放在[invokesPath]对应的文件夹下
文件内容为
export type InvokeApiType = {
  [name1]: typeof import([./[name]/exportFn])["[name]Fn"],
  [namespace]:{
    [name1]: typeof import([./[namespace]/[name]/exportFn])["[name]Fn"],
    ...
  }
}
name为文件夹名
注意以下写法使用ES模块
*/
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