import { ListStore } from "../../store/listStore";

export const dialogOptions = <TestModuleDialogType>{
  title: "连接设备",
  targetMethodName: "connectTo",
  content: "请输入要连接的设备",
  args: [
    {
      name: "targetDevice",
      componentType: "select",
      label: "设备",
      options: (store: ListStore)=> store.deviceList,
      value: "",
    },
  ],
};