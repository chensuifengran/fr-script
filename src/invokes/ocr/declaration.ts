export const declaration = `
declare type OCRResult = {
  position: [
      [number, number],
      [number, number],
      [number, number],
      [number, number]
  ];
  text: string;
  score: number;
};
declare class FindResult {
  centerPos: [number, number];
  text: string;
  score: number;
  constructor(
    position: OCRResult["position"],
    text: string,
    score: number,
    offset?: [number, number]
  );
  public click(): Promise<void>;
  public touch(): Promise<string>;
};
declare class OcrUtil {
  result: OCRResult[];
  private reCall: () => Promise<OcrUtil | undefined>;
  private ori: {
    x: number;
    y: number;
  };
  constructor(originX: number, originY: number, result: OCRResult[], reCall:() => Promise<OcrUtil | undefined>);
  public includes(texts: string[]): boolean;
  public findText(text: string, offset?: [number, number]): FindResult | null;
  public waitText(text: string,adb?: boolean, sleepMs?: number, maxWaitCount?: number): Promise<boolean>;
};
declare function ocr(
  x: number,
  y: number,
  width: number,
  height: number,
  imgPath?: string
): Promise<OcrUtil | undefined>;
`