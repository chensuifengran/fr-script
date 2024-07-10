export const dialogOptions = {
  title: "输出日志",
  targetMethodName: "log",
  content: "在运行控制台或弹窗中输出日志信息",
  args: <ArgItem[]>[
    {
      name: "msg",
      componentType: "input",
      value: "",
      label: "要输出的日志信息",
    },
    {
      name: "type",
      componentType: "select",
      value: "info",
      label: "日志类型",
      options:[
        "success","danger","info","warning","loading"
      ]
    },
  ],
};
