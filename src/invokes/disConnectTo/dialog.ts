import { ListStore } from "../../store/listStore";

export const dialogOptions = (store:ListStore) => {
  return {
    title: "断开连接设备",
    targetMethodName: "disConnectTo",
    content: "请输入要断开连接的设备",
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
