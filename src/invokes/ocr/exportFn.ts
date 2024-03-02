import { invoke } from "@tauri-apps/api";
import { OcrUtil } from "./OcrUtil";
export type OCRResult = {
  position: [
    [number, number],
    [number, number],
    [number, number],
    [number, number]
  ];
  text: string;
  score: number;
};
export const ocrFn = async (
  x: number,
  y: number,
  width: number,
  height: number,
  imgPath?: string,
  taskId?: string
): Promise<OcrUtil | undefined> => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    let ocrRes;
    if (imgPath) {
      ocrRes = await invoke<string>("ocr", {
        x,
        y,
        width,
        height,
        imgPath,
      });
    } else {
      ocrRes = await invoke<string>("screen_ocr", {
        x,
        y,
        width,
        height,
      });
    }
    const resObject = JSON.parse(ocrRes) as {
      code: number;
      result: OCRResult[];
    };
    if (resObject.code === 1) {
      const reCall = () => {
        if(imgPath){
          console.warn("由于是指定图片识别，如果图片不更新，将导致识别结果每次都一样!");
        }
        return ocrFn(x, y, width, height, imgPath, taskId)
      };
      return new OcrUtil(x, y, resObject.result, reCall);
    }
  } catch (error) {
    console.error("ocrError: ", error);
  }
};

export type PpocrFnType = typeof ocrFn;
