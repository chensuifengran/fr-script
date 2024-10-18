import tempDeviceId from "./useOsInfo";

export type WssState = "在线" | "离线";
export type ReqMsg = {
  type: "LINK_REQ";
  code: string;
  deviceId: string;
  accessToken: string;
};
export type Commands = "REQUEST_SCRIPT_LIST";
export type CommandMsg = {
  type: "COMMAND";
  command: Commands;
};
export type CBMsg = ReqMsg | CommandMsg;
export type MsgCallback = (msg: CBMsg) => void;
const messageSubs: MsgCallback[] = [];
const wssState = ref<WssState>("离线");

let ws: WebSocket | null = null;
const createWs = () => {
  if (ws) {
    console.error("useWss createWs error: WebSocket已经存在");
    return;
  }
  try {
    ws = new WebSocket("ws://" + API_BASE_HOST);
    ws.onopen = function () {
      console.log("Connected to the server.");
      ws?.send(
        JSON.stringify({
          type: "INIT",
          token: getToken(),
          deviceId: tempDeviceId.value,
        })
      );
    };

    ws.onmessage = function (event) {
      let msg: any = "";
      try {
        msg = JSON.parse(event.data);
      } catch (error) {
        msg = event.data;
      }
      console.log("Received data from server: ", msg);
      messageSubs.forEach((sub) => sub(msg));
    };

    ws.onclose = function (event) {
      if (event.wasClean) {
        console.log(
          `Connection closed cleanly, code=${event.code}, reason=${event.reason}`
        );
      } else {
        console.log("Connection died");
      }
    };
    ws.onerror = function (error) {
      console.log(`Error: ${error}`);
    };
    ElMessage.success("WebSocket连接成功");
  } catch (error) {
    console.error(error);
    ElMessage.error("WebSocket连接失败");
    wssState.value = "离线";
  }
};
const closeWs = () => {
  ws?.close();
  ws = null;
};
watch(wssState, () => {
  if (wssState.value === "在线") {
    createWs();
  } else {
    closeWs();
    useControl().closeAutoOnline();
  }
});
const onMsg = (callback: MsgCallback) => {
  const index = messageSubs.length;
  messageSubs.push(callback);
  return () => {
    messageSubs.splice(index, 1);
  };
};
const responseReq = (success: boolean, reason?: string) => {
  const { controlDeviceInfo } = useControl();
  ws?.send(
    JSON.stringify({
      type: "LINK_RESP",
      accessToken: controlDeviceInfo.accessToken,
      success,
      reason,
      token: getToken(),
    })
  );
};
const responseScriptList = (
  scriptList: {
    id: string;
    name: string;
    description: string;
  }[]
) => {
  const { controlDeviceInfo } = useControl();
  ws?.send(
    JSON.stringify({
      type: "FORWARD",
      token: getToken(),
      accessToken: controlDeviceInfo.accessToken,
      reverse: true,
      data: {
        type: "COMMAND",
        command: "RESPONSE_SCRIPT_LIST",
        data: scriptList,
      },
    })
  );
};
export const useWss = () => {
  return {
    wssState,
    createWs,
    closeWs,
    onMsg,
    responseReq,
    responseScriptList
  };
};
