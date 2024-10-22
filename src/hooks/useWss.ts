import { nanoid } from "nanoid";
import tempDeviceId from "./useOsInfo";

export type WssState = "在线" | "离线";
export type ReqMsg = {
  type: "LINK_REQ";
  code: string;
  deviceId: string;
  accessToken: string;
};
export namespace Command {
  export type REQUEST_SCRIPT_LIST = {
    command: "REQUEST_SCRIPT_LIST";
  };
  export type RUN_SCRIPT = {
    command: "RUN_SCRIPT";
    scriptId: string;
  };
  export type SyncForm = {
    command: "SYNC_FORM";
    form: RendererList[];
    syncId: string;
  };
  export type DeprecatedSyncId = {
    command: "DEPRECATED_SYNC_ID";
    syncId: string;
  };
  export type ExecScript = {
    command: "EXECUTE_SCRIPT";
    state: "execute" | "stop" | "reinit";
  };
}
export type Commands =
  | Command.REQUEST_SCRIPT_LIST
  | Command.RUN_SCRIPT
  | Command.SyncForm
  | Command.DeprecatedSyncId
  | Command.ExecScript;
export type CommandMsg = {
  type: "COMMAND";
} & Commands;
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
let syncId = "";
const syncRendererList = (list: RendererList[] = [], useSyncForm?: boolean) => {
  const { controlDeviceInfo } = useControl();
  let sid;
  if (syncId === "") {
    sid = nanoid();
    syncId = sid;
  } else {
    sid = syncId;
  }
  if (!useSyncForm) {
    console.log("RESPONSE_RUN_SCRIPT", syncId);
  }
  ws?.send(
    JSON.stringify({
      type: "FORWARD",
      token: getToken(),
      accessToken: controlDeviceInfo.accessToken,
      reverse: true,
      data: {
        type: "COMMAND",
        command: useSyncForm ? "SYNC_FORM" : "RESPONSE_RUN_SCRIPT",
        form: processRList(list),
        syncId: sid,
      },
    })
  );
};

const sendDeprecatedSyncId = (syncId: string) => {
  const { controlDeviceInfo } = useControl();
  ws?.send(
    JSON.stringify({
      type: "FORWARD",
      token: getToken(),
      accessToken: controlDeviceInfo.accessToken,
      reverse: true,
      data: {
        type: "COMMAND",
        command: "DEPRECATED_SYNC_ID",
        syncId,
      },
    })
  );
};
const existSyncId = (id: string) => {
  if (syncId === id) {
    syncId = "";
    sendDeprecatedSyncId(id);
    return true;
  }
  syncId = id;
  return false;
};
const deprecatedSyncId = (_syncId: string) => {
  if (syncId === _syncId) {
    syncId = "";
  }
};
const syncLog = (
  log: string,
  time: string,
  logType: "success" | "warning" | "info" | "loading" | "danger"
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
        command: "SYNC_LOG",
        log,
        time,
        logType,
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
    responseScriptList,
    syncRendererList,
    sendDeprecatedSyncId,
    deprecatedSyncId,
    existSyncId,
    syncLog
  };
};
