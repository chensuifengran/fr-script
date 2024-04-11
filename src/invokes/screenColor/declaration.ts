export const declaration = `
declare class ColorUtil {
  public rgb: [number, number, number];
  private reCall: () => Promise<ColorUtil | undefined>;
  constructor(
    rgb: [number, number, number],
    reCall: () => Promise<ColorUtil | undefined>
  );
  getHex: () => string;
  /**
   * 获取rgb字符串
   * 如：rgb(255,255,255)
  */
  getRgb: () => string;
  /**
   * 获取rgb值字符串（仅获取值）
   * 如：255,255,255
  */
  getRgbValue: () => string;
  parseColorStr: (color: string) => [number, number, number] | undefined;
  /**
   * 判断颜色是否匹配
   * @param color 颜色字符串
   * @param allowOffsetRange 允许的偏移范围
   * @returns 是否匹配
  */
  is: (color: string, allowOffsetRange?:[number, number, number]) => boolean;
  /**
   * 等待该位置出现预期颜色
   * @param color 预期颜色字符串
   * @param sleepMs 检测间隔，默认1000ms
   * @param maxWaitCount 最大检测次数,默认10次
   * @param allowOffsetRange rgb值允许的偏移范围，默认[0,0,0]
   * @param mismatchCallback 颜色不匹配时的回调
   * @returns 是否匹配
  */
  waitColor: (
    color: string,
    sleepMs?: number,
    maxWaitCount?: number,
    allowOffsetRange?:[number, number, number],
    mismatchCallback?: (curColor: string, expectedColor: string) => void
  ) => Promise<boolean>;
  /**
   * 等待该位置颜色消失
   * @param color 颜色字符串
   * @param sleepMs 检测间隔，默认1000ms
   * @param maxWaitCount 最大检测次数,默认10次
   * @param allowOffsetRange rgb值允许的偏移范围，默认[0,0,0]
   * @returns 是否消失
  */
  waitNotColor: (
    color: string,
    sleepMs?: number,
    maxWaitCount?: number,
    allowOffsetRange?:[number, number, number]
  ) => Promise<boolean>;
}
declare function screenColor(
    x?:number,
    y?:number,
):Promise<ColorUtil | undefined>;
`;
