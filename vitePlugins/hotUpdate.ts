import { Plugin } from "vite";
import {
  genEnumDTS,
  genBuiltInApiDTS,
  genBuildFormDTS,
  genAllDTS,
} from "./genDTS";
import { changeLogLevel } from "./logConf";
import { LOGO_TEXT } from "./constants";
export function hotUpdatePlugin(): Plugin {
  return {
    name: "hot-update-plugin",
    configResolved(config) {
      console.log(LOGO_TEXT);
      const mode = config.env.MODE;
      if (mode && mode.includes(":")) {
        const [_, logLevel] = mode.split(":");
        changeLogLevel(logLevel);
      } else {
        changeLogLevel();
      }
      genAllDTS();
    },
    handleHotUpdate({ file }) {
      if (file.endsWith(".ts")) {
        const excludeFiles = ["builtInApi.d.ts", "core.d.ts"];
        if (
          excludeFiles.find((e) => file.includes(e) || file.includes(".ag.ts"))
        ) {
          return;
        }

        //hooks
        if (file.includes("useScriptApi.ts") || file.includes("useCore.ts")) {
          genBuiltInApiDTS("declare");
        }

        //invokes
        if (file.includes("buildForm.d.ts")) {
          genBuildFormDTS("buildForm");
        } else if (file.includes("renderList.d.ts")) {
          genBuildFormDTS("renderList");
        } else if (file.includes("enums.ts")) {
          genEnumDTS();
        } else if (file.includes("invokes/")) {
          genBuiltInApiDTS();
        }
      }
    },
  };
}
