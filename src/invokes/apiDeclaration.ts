import { UTIL_DECLARE_STRING } from "./utilDeclareTypes";
//所有用于编辑器提示的函数声明字符串
const declaration = import.meta.glob("./**/declaration.ts", {
  eager: true,
  import: "declaration",
});
export const allDeclarationString = Object.values(declaration)
  .join("\n")
  .trim();
export const editorTsDeclaration = `
${UTIL_DECLARE_STRING}
${allDeclarationString}
`;
