import { invoke } from "@tauri-apps/api";
const { resolve, getInstallDir } = pathUtils;
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
const adb = async (adb_command: string) => {
  const adbPath = await resolve(await getInstallDir(), "adb/adb.exe");
  return run(`${adbPath} ${adb_command}`);
};
export const execCommand = {
  run,
  adb,
};
