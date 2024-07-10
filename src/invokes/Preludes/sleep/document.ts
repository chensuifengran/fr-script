export const apiDocument = <ApiDocumentType>{
  howToUse: "休眠指定时长",
  params: [
    {
      name: "ms",
      required: false,
      instructions: "休眠时长的毫秒数",
      type: "number",
      default: "1000",
    },
  ],
  returnValue: {
    type: codeHighLight(`Promise<void>`),
  },
  example: {
    code: codeHighLight(`//休眠1000ms
await sleep();
//休眠2000ms
await sleep(2000);`),
  },
  searchKeys: ["sleep", "休眠", "停止","等待", "暂停", "延时"],
  codeSnippet: "sleep(${1:time_ms});",
};
