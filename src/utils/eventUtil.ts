import { emit, listen, Event } from "@tauri-apps/api/event";
type EventTarget =
  | {
      kind: "Any";
    }
  | {
      kind: "AnyLabel";
      label: string;
    }
  | {
      kind: "App";
    }
  | {
      kind: "Window";
      label: string;
    }
  | {
      kind: "Webview";
      label: string;
    }
  | {
      kind: "WebviewWindow";
      label: string;
    };
const notify = {
  clear: () =>
    emit("notify", {
      type: "clear-message",
    }),
  done: () =>
    emit("notify", {
      type: "done",
    }),
  init: (payload: any) =>
    emit("notify", {
      type: "init",
      payload,
    }),
  end: () =>
    emit("notify", {
      type: "end",
    }),
  send: (payload: any) =>
    emit("notify", {
      type: "message",
      payload,
    }),
  sendCustom: (payload: { name: string; message: string }) =>
    emit("notify", {
      type: "custom-message",
      payload,
    }),
  listen: async <T = any>(
    callback: (payload: Event<T>) => void,
    target?: string | EventTarget
  ) => {
    const unlisten = await listen<T>(
      "notify",
      (payload) => {
        callback(payload);
      },
      { target }
    );
    return unlisten;
  },
};

export const eventUtil = {
  notify,
};
