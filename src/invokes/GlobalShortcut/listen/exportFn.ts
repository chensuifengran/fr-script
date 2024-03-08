import {
  isRegistered,
  registerAll,
  unregister,
} from "@tauri-apps/api/globalShortcut";

export const listenFn = async (
  keys: string[],
  handler: (key: string) => void,
  taskId?: string
) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    for (const key of keys) {
      await unregister(key);
    }
    for (const key of keys) {
      if (await isRegistered(key)) {
        console.error(`快捷键:${key}被其他程序占用，无法继续使用！`);
        return;
      }
    }
    await registerAll(keys, handler);
    return async () => {
      for (const key of keys) {
        await unregister(key);
      }
    };
  } catch (error) {
    console.error("listenFnError:", error);
  }
};
