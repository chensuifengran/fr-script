export const apiDocument = <ApiDocumentType>{
  howToUse: "识别屏幕/图片指定位置",
  params: [
    {
      name: "x",
      required: false,
      instructions: "识别区域起点X坐标",
      type: "number",
      default: "-1",
    },
    {
      name: "y",
      required: false,
      instructions: "识别区域起点y坐标",
      type: "number",
      default: "-1",
    },
    {
      name: "width",
      required: false,
      instructions: "识别区域宽度",
      type: "number",
      default: "-1",
    },
    {
      name: "height",
      required: false,
      instructions: "识别区域高度",
      type: "number",
      default: "-1",
    },
    {
      name: "imgPath",
      required: false,
      instructions: "图片路径, 为空时识别屏幕内容",
      type: "string",
      default: "",
    },
  ],
  returnValue: {
    type: `
//返回值：
Promise<OcrUtil | undefined>
//OcrUtil类声明：
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
   * @param mismatchCallback 文本不匹配时的回调,result为识别的结果,expectText为预期文本
   * @returns 文本出现为true，到达最大检测次数时为false
   */
  public waitText(
    text: string,
    adb?: boolean,
    sleepMs?: number,
    maxWaitCount?: number,
    mismatchCallback?: (result: OCRResult[], expectText: string) => void
  ): Promise<boolean>;
}
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
`,
  },
  example: {
    title: '该API在"测试调用"后会动态填入参数到示例',
    code: `const ocrUtil = await ocr(0, 0, 100, 100);`,
  },
  searchKeys: ["OCR", "ocr", "图片", "指定范围"],
  codeSnippet:
    "const ocrUtil = await ocr(${1:x}, ${2:y}, ${3:width}, ${4:height})",
};
