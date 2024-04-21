export const apiDocument = <ApiDocumentType>{
  howToUse: "获取鼠标位置",
  returnValue: {
    type: codeHighLight("Promise<{ x: number, y: number }>"),
  },
  example: {
    code: codeHighLight(
      'const {x, y} = await Mouse.pos();'
    ),
  },
  searchKeys: ["鼠标", "位置", "获取"],
  codeSnippet:'const {x, y} = await Mouse.pos();'
};
