export const apiDocument = <ApiDocumentType>{
  howToUse: "输出日志",
  params: [
    {
      name: "msg",
      required: true,
      instructions: "要输出的日志信息",
      type: "string",
      default: "",
    },
    {
      name: "type",
      required: false,
      instructions: "日志类型",
      type: ["'success'", "'danger'", "'info'", "'warning'", "'loading'"],
      default: "'info'",
    },
  ],
  returnValue: {
    type: `void`,
  },
  example: {
    code: `//info类型日志：
log("我是日志");
//success类型日志：
log("我是日志", "success");
//danger类型日志：
log("我是日志", "danger");
//warning类型日志：
log("我是日志", "warning");
//loading类型日志：
log("我是日志", "loading");`,
  },
  searchKeys: ["log", "日志", "Preludes"],
  codeSnippet: "log('${1:日志内容}'${2:, 'loading'});",
};
