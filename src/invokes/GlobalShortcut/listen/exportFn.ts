import {
  isRegistered,
  register,
  type ShortcutHandler,
  unregister,
} from "@tauri-apps/plugin-global-shortcut";
import { sleepFn } from "../../Preludes/sleep/exportFn";

export const listenFn = async (
  shortcuts: string | string[],
  handler: ShortcutHandler,
  taskId?: string
) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    //尝试取消已注册的快捷键
    for (const shortcut of shortcuts) {
      if (await isRegistered(shortcut)) {
        await unregister(shortcut);
      }
    }
    for (const shortcut of shortcuts) {
      if (await isRegistered(shortcut)) {
        console.error(`快捷键:${shortcut}被其他程序占用，无法继续使用！`);
        return;
      }
    }
    await register(shortcuts, handler);
    return async () => {
      await sleepFn(0);
      for (const shortcut of shortcuts) {
        if (await isRegistered(shortcut)) {
          await unregister(shortcut);
        }
      }
    };
  } catch (error) {
    console.error("listenFnError:", error);
  }
};
