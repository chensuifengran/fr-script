export const apiDocument = <ApiDocumentType>{
  howToUse: "鼠标左键进行连续点击一段时间",
  params: [
    {
      name: "duration",
      required: true,
      instructions: "连续点击时间(s)",
      type: "number",
      default: "",
    },
    {
      name: "sleep",
      required: false,
      instructions: "点击间隔时间(ms)",
      type: "number",
      default: "50",
    },
    {
      name: "button",
      required: false,
      instructions: "鼠标按键",
      type: ["'left'", "'right'", "'middle'"],
      default: "'left'",
    }
  ],
  returnValue: {
    instructions: "返回一个停止点击器的函数，调用此函数可停止连续点击。",
    type: codeHighLight("Promise<() => Promise<void>>"),
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: codeHighLight(`//鼠标移动到(100,100)
await Mouse.move(100,100);
//调用点击器，连续点击鼠标右键5s，点击间隔10ms
const stop = await Mouse.clicker(5,10, 'right');
//3s后停止点击
await sleep(3000);
await stop();
      `),
  },
  searchKeys: ["鼠标", "mouse", "左键", "连续", "点击"],
  codeSnippet: "await Mouse.clicker(${1:duration}, ${2:sleep});",
};
