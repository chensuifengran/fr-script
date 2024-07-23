export const apiDocument = <ApiDocumentType>{
  howToUse: "获取鼠标位置",
  returnValue: {
    type: "Promise<{ x: number, y: number }>",
  },
  example: {
    code: "const {x, y} = await Mouse.pos();",
  },
  searchKeys: ["鼠标", "位置", "获取"],
  codeSnippet: "const {x, y} = await Mouse.pos();",
};
