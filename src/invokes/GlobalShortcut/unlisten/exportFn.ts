import {
  unregister,
} from "@tauri-apps/api/globalShortcut";

export const unlistenFn = async (keys: string[], taskId?: string) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    for (const key of keys) {
      await unregister(key);
    }
  } catch (error) {
    console.error("unlistenFnError:", error);
  }
};
