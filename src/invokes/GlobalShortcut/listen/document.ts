export const apiDocument = <ApiDocumentType>{
  howToUse: "监听快捷键触发，触发后调用回调函数。",
  params: [
    {
      name: "keys",
      required: true,
      instructions: "等待触发的快捷键，如：['Alt+S','Alt+E']",
      type: "string[]",
      default: "",
    },
    {
      name: "handler",
      required: true,
      instructions: "快捷键触发后的回调函数，参数key为触发的快捷键",
      type: "(key:string)=>void",
      default: "",
    },
  ],
  returnValue: {
    instructions: "返回一个函数，调用该函数可以取消监听",
    type: `Promise<(() => Promise<void>) | undefined>`,
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: `//等待 Alt+S 或 Alt+R 被按下
const unlisten = await GlobalShortcut.listen(["Alt+S","Alt+R"],(key)=>{console.log(key);});//监听快捷键
//取消监听
if(unlisten){
  await unlisten();
}`,
  },
  searchKeys: ["unlisten", "listen", "触发", "快捷键"],
  codeSnippet:
    "const unlisten = await GlobalShortcut.listen(['${1:key}'],(key)=>{${2:}});",
};
