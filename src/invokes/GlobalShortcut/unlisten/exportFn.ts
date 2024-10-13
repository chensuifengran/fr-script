import { isRegistered, unregister } from "@tauri-apps/plugin-global-shortcut";

export const unlistenFn = async (
  shortcuts: string | string[],
  taskId?: string
) => {
  if (IS_PLAYGROUND_ENV) {
    console.error("playground环境下无法使用：unlisten");
    return;
  }
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    for (const shortcut of shortcuts) {
      if (await isRegistered(shortcut)) {
        await unregister(shortcut);
      }
    }
  } catch (error) {
    console.error("unlistenFnError:", error);
  }
};
