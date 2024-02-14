import { UTIL_DECLARE_STRING } from "./utilDeclareTypes";

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
export const editorTsDeclaration = `
${UTIL_DECLARE_STRING}
${allDeclarationString}
`;
