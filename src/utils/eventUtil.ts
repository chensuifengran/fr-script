import { emit, listen, Event } from "@tauri-apps/api/event";
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
  listen: async <T = any>(callback: (payload: Event<T>) => void) => {
    const unlisten = await listen<T>("notify", (payload) => {
      callback(payload);
    });
    return unlisten;
  },
};

export const eventUtil = {
  notify,
};
