export const dialogOptions = <TestModuleDialogType>{
  title: "构建表单",
  targetMethodName: "buildForm",
  content: "构建与用户交互的表单",
  args: [
    {
      name: "formItems",
      label: "表单项",
      componentType: "buildFormEditor",
      value: [],
      disabledEdit: true,
    },
  ],
};
