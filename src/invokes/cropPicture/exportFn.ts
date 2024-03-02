import { invoke } from "@tauri-apps/api/tauri";

export const cropPictureFn = async (
  path: string,
  x: number,
  y: number,
  width: number,
  height: number,
  outPath: string,
  taskId?: string
) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try{
    const res = await invoke<string>("crop_picture", {
      path,
      x,
      y,
      width,
      height,
      outPath,
    });
    const json = JSON.parse(res);
    if(json.code === 200){
      return 1;
    }else{
      return 0;
    }
  }catch(e){
    console.error(e);
    return -1;
  }
};