export const dialogOptions = {
  title: "执行cmd命令",
  targetMethodName: "cmd",
  content: "执行cmd命令",
  args: [
    {
      name: "command",
      componentType: "input",
      label: "需要执行的命令",
      value: "",
    },
    {
      name: "onlyExec",
      componentType: "switch",
      label: "是否只执行命令，不返回结果",
      value: false,
    }
  ],
};
