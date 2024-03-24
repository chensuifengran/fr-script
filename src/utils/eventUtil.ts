import { emit, listen } from "@tauri-apps/api/event";
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
  listen: async (callback: (payload: any) => void) => {
    const unlisten = await listen("notify", (payload) => {
      callback(payload);
    });
    return unlisten;
  },
};

export const eventUtil = {
  notify,
};
