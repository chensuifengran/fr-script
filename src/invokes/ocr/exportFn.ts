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
    const resObject = await invokeBaseApi.ocr(x, y, width, height, imgPath);
    if (!resObject) {
      return;
    }
    if (resObject.code === 1) {
      const reCall = () => {
        if (imgPath) {
          console.warn(
            "由于是指定图片识别，如果图片不更新，将导致识别结果每次都一样!"
          );
        }
        return ocrFn(x, y, width, height, imgPath, taskId);
      };
      return new OcrUtil(x, y, resObject.result, reCall);
    }
  } catch (error) {
    console.error("ocrError: ", error);
  }
};

export type PpocrFnType = typeof ocrFn;
