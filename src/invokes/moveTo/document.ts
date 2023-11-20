export const apiDocument = <ApiDocumentType>{
  howToUse: `将鼠标移动到指定位置`,
  params: [
    {
      name: "x",
      required: true,
      instructions: "目标位置x坐标",
      type: "number",
      default: "",
    },
    {
      name: "y",
      required: true,
      instructions: "目标位置y坐标",
      type: "number",
      default: "",
    },
    {
      name:'randomRange',
      required:false,
      instructions:'随机偏移',
      type:'[[number,number],[number,number]]',
      default:'[[0,0],[0,0]]'
    },
  ],
  returnValue: {
    type: codeHighLight(`Promise<string>`),
    instructions: "移动结果",
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: codeHighLight(
      `const res = await moveTo(100,100);`
    ),
  },
  searchKeys: ["mouse",'moveTo', "移动"],
  codeSnippet: "const ${1:res} = await moveTo('${2:x}', '${3:y}', `${4:[[0,0],[0,0]]}}`);",
};
