import { invoke } from "@tauri-apps/api";

export const screenColorFn = async (
  x: number = -1,
  y: number = -1,
  taskId?: string
): Promise<[number, number, number] | undefined> => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    let res;
    if(x !== -1 && y !== -1){
      res = await invoke<string>("screen_color", {
        x,
        y,
      });
    }else{
      res = await invoke<string>("screen_color");
    }

    const json = JSON.parse(res);
    if (json.message === "success") {
      return json.data as [number, number, number];
    }
    return;
  } catch (e) {
    console.error("screenColorError: ", e);
  }
};
