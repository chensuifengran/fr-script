import { Plugin } from "vite";
import {
  genEnumDTS,
  genBuiltInApiDTS,
  genBuildFormDTS,
  genAllDTS,
} from "./genDTS";
import { changeLogLevel } from "./logConf";
export function hotUpdatePlugin(): Plugin {
  return {
    name: "hot-update-plugin",
    configResolved(config) {
      const mode = config.env.MODE;
      if (mode && mode.includes(":")) {
        const [_, logLevel] = mode.split(":");
        changeLogLevel(logLevel);
      }
      genAllDTS();
    },
    handleHotUpdate({ file }) {
      if (file.endsWith(".ts")) {
        const excludeFiles = [
          "builtInApi.d.ts",
          "core.d.ts",
          "buildFormDeclare.ts",
          "rendererListDeclare.ts",
          "enums.d.ts",
        ];
        if (excludeFiles.find((e) => file.includes(e))) {
          return;
        }
        if (file.includes("invokes/")) {
          genBuiltInApiDTS();
        }
        if (file.includes("useScriptApi.ts") || file.includes("useCore.ts")) {
          genBuiltInApiDTS("declare");
        }
        if (file.includes("buildForm.d.ts")) {
          genBuildFormDTS("buildForm");
        } else if (file.includes("rendererList.d.ts")) {
          genBuildFormDTS("rendererList");
        } else if (file.includes("enums.ts")) {
          genEnumDTS();
        }
      }
    },
  };
}
