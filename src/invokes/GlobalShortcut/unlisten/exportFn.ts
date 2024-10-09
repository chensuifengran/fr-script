import { isRegistered, unregister } from "@tauri-apps/plugin-global-shortcut";

export const unlistenFn = async (
  shortcuts: string | string[],
  taskId?: string
) => {
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
