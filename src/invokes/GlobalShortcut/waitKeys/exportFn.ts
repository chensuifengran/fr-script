import { isRegistered, registerAll, unregister } from "@tauri-apps/api/globalShortcut";

export const waitKeysFn = async (keys: string[], taskId?: string) => {
  if(IS_PLAYGROUND_ENV){
    console.warn("playground环境下无法使用快捷键！");
    return;
  }
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
    const result = await new Promise<string>(resolve=>{
      registerAll(keys, (key:string)=>{
        resolve(key);
      })
    });
    for(const key of keys){
      await unregister(key);
    }
    return result;
  } catch (error) {
    console.error("waitKeysFnError:", error);
  }
};
