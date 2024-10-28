import { getInjectConstantType } from "./constantInject";
import { KeyOptions } from "./Input/KeyOptions";
/**
 * 提供给编辑器的类型声明, 用于代码提示
 * @returns {string}
 */
export const editorTsDeclaration = (): string => {
  const index = import.meta.glob<Record<string, any>>("./**/index.ts", {
    eager: true,
  });
  const scopes: Record<string, string[]> = {
    root: [],
  };
  const keys = Object.keys(index);
  keys.forEach((key) => {
    let indexModule;
    let name;
    if (key.split("/").length === 4) {
      name = key.split("/")[2];
    } else {
      name = key.split("/")[1];
    }
    indexModule =
      index[key.replace("declaration.ts", "index.ts")][name + "Api"];
    if (!indexModule) {
      console.error(
        `找不到${name}Api`,
        index[key.replace("declaration.ts", "index.ts")],
        key
      );
      return;
    }
    const { declaration: d } = indexModule;
    const scope = indexModule.scope;
    if (!scope) {
      scopes.root.push(d);
    } else {
      if (!scopes[scope]) {
        scopes[scope] = [];
      }
      scopes[scope].push(d);
    }
  });
  let allDeclarationString = "";
  Object.keys(scopes).forEach((key) => {
    if (key === "root") {
      allDeclarationString += scopes[key].join("\n");
    } else {
      allDeclarationString += `declare namespace ${key} {\n${scopes[key].join(
        "\n"
      )}\n}\n`;
    }
  });
  const INPUT_KEY_TYPE = `declare type Key = ${KeyOptions.map(
    (i) => `"${i.split(":")[1]}"`
  ).join("|")};`;
  const constantSlotContent = getInjectConstantType();
  const UTIL_DECLARE_STRING = getCommanDeclareTypes(constantSlotContent);
  return `
${ENUM_DECLARE.trim()}
${INPUT_KEY_TYPE.trim()}
${UTIL_DECLARE_STRING.trim()}
${BUILD_FORM_DECLARE.trim()}
${RENDER_LIST_DECLARE.trim()}
${allDeclarationString.trim()}
`.trim();
};
