import { ListStore } from "../../store/listStore";

export const dialogOptions = (store: ListStore) => {
  return {
    title: "连接设备",
    targetMethodName: "connectTo",
    content: "请输入要连接的设备",
    args: [
      {
        name: "targetDevice",
        componentType: "select",
        label: "设备",
        options: store.deviceList,
        value: "",
      },
    ],
  };
};
