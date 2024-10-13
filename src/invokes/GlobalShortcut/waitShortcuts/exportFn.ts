import {
  isRegistered,
  register,
  unregister,
} from "@tauri-apps/plugin-global-shortcut";

export const waitShortcutsFn = async (
  shortcuts: string | string[],
  taskId?: string
) => {
  if (IS_PLAYGROUND_ENV) {
    console.error("playground环境下无法使用：waitShortcuts");
    return;
  }
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    for (const shortcut of shortcuts) {
      if (await isRegistered(shortcut)) {
        console.error(`快捷键:${shortcut}被其他程序占用，无法继续使用！`);
        return;
      }
    }
    const result = await new Promise<string>((resolve) => {
      register(shortcuts, (event) => {
        resolve(event.shortcut);
      });
    });
    await unregister(shortcuts);
    return result;
  } catch (error) {
    console.error("waitShortcutsFnError:", error);
  }
};
