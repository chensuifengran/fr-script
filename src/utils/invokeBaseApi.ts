import { invoke } from "@tauri-apps/api";

const getScreenSize = async () => {
  const res = await invoke<string>("get_screen_size");
  return JSON.parse(res) as {
    width: number;
    height: number;
  };
};
const getMousePos = async () => {
  const res = await invoke<string>("mouse_get_pos");
  return (JSON.parse(res) as any).message as { x: number; y: number };
};

export const invokeBaseApi = {
  getScreenSize,
  getMousePos
};
