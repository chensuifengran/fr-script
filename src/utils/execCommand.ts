import { invoke } from "@tauri-apps/api";

const run = async (cmd: string) => {
  try {
    const res = await invoke<string>("run_cmd", {
      command: cmd,
    });
    const result = JSON.parse(res) as {
      code: number;
      message: string;
    };
    if (result.code === 200) {
      return Promise.resolve(result.message);
    } else {
      console.error(res);
      return Promise.reject(result.message);
    }
  } catch (e) {
    console.error(e);
    return Promise.reject(e);
  }
};
export const execCommand = {
  run
};
