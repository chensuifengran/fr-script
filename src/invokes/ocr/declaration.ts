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
  /**
   * 鼠标点击目标元素的中心位置
   */
  public click(): Promise<void>;
  /**
   * [ADB]触摸目标元素的中心位置
   * @returns 触摸命令执行结果，一般可忽略
   */
  public touch(): Promise<string>;
}
declare class OcrUtil {
  result: OCRResult[];
  private reCall: () => Promise<OcrUtil | undefined>;
  private ori: {
    x: number;
    y: number;
  };
  constructor(
    originX: number,
    originY: number,
    result: OCRResult[],
    reCall: () => Promise<OcrUtil | undefined>
  );
  /**
   * 判断是否包含指定文本
   * @param texts 文本数组
   * @returns 是否包含数组中的任意一个文本
   */
  public includes(texts: string[]): boolean;

  /**
   * 查找文本，返回所有匹配的结果
   * @param text 文本
   * @param offset 文本位置附加的偏移量
   * @returns 匹配结果数组
   */
  public searchText(text: string, offset?: [number, number]): FindResult[];
  /**
   * 查找文本，返回第一个匹配的结果
   * @param text 文本
   * @param offset 文本位置附加的偏移量
   * @returns 匹配结果
   */
  public findText(
    text: string,
    offset?: [number, number]
  ): FindResult | undefined;
  /**
   * 等待文本出现
   * @param text 文本
   * @param adb 识别前是否执行adb截图
   * @param sleepMs 检测间隔，默认1000ms，不含识别时间
   * @param maxWaitCount 最大检测次数,默认10次
   * @param mismatchCallback 检测时，文本不匹配时的回调
   * @returns 文本出现为true，到达最大检测次数时为false
   */
  public waitText(
    text: string,
    adb?: boolean,
    sleepMs?: number,
    maxWaitCount?: number,
    mismatchCallback?: (curText: OCRResult[], expectText: string) => void
  ): Promise<boolean>;
}
declare function ocr(
  x: number,
  y: number,
  width: number,
  height: number,
  imgPath?: string
): Promise<OcrUtil | undefined>;
`;
