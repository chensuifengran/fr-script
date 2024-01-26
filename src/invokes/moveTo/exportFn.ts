import { invoke } from "@tauri-apps/api/tauri";

export const moveToFn = async (
  x: number,
  y: number,
  randomRange: [[number, number], [number, number]] = [
    [0, 0],
    [0, 0],
  ],
  taskId?: string
) => {
  const { notAllowedFnId }  = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  x =
    x +
    Math.floor(
      Math.random() * (randomRange[0][1] - randomRange[0][0]) +
        randomRange[0][0]
    );
  y =
    y +
    Math.floor(
      Math.random() * (randomRange[1][1] - randomRange[1][0]) +
        randomRange[1][0]
    );

  return await invoke<string>("mouse_move_to", {
    x,
    y,
  });
};

export type MoveToFnType = typeof moveToFn;
