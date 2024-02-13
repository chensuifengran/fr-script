import { UTIL_DECLARE_STRING } from "./utilDeclareTypes";
//所有用于编辑器提示的函数声明字符串
// const declaration = import.meta.glob("./**/declaration.ts", {
//   eager: true,
//   import: "declaration",
// });
const index = import.meta.glob<Record<string,any>>("./**/index.ts", {
  eager: true,
});
const scopes: Record<string, string[]> = {
  root: [],
};
const keys = Object.keys(index);
keys.forEach((key)=>{
  const name = key.split("/")[1];
  const indexModule = index[key.replace("declaration.ts", "index.ts")][name+"Api"];
  const {scope,declaration:d} = indexModule;
  if(!scope){
    scopes.root.push(d);
  }else{
    if(!scopes[scope]){
      scopes[scope] = [];
    }
    scopes[scope].push(d);
  }
});
let allDeclarationString = '';
Object.keys(scopes).forEach((key)=>{
  if(key === "root"){
    allDeclarationString += scopes[key].join("\n");
  }else{
    allDeclarationString += `declare namespace ${key} {\n${scopes[key].join("\n")}\n}\n`;
  }
})

console.log("api-declaration", allDeclarationString);

// export const allDeclarationString = Object.values(declaration)
//   .join("\n")
//   .trim();
export const editorTsDeclaration = `
${UTIL_DECLARE_STRING}
${allDeclarationString}
`;
