export const apiDocument = <ApiDocumentType>{
  howToUse: "获取屏幕的宽高",
  returnValue: {
    type: codeHighLight("Promise<{ width:number; height:number; }>"),
  },
  example: {
    code: codeHighLight(
      'const { width, height } = await getScreenSize();'
    ),
  },
  searchKeys: ["屏幕", "宽高", "获取"],
  codeSnippet:'const { width, height } = await getScreenSize();'
};
