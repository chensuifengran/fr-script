import { timeUtil } from "../../utils/timeUtil";

export class ColorUtil {
  private reCall: () => Promise<ColorUtil | undefined>;
  constructor(
    public rgb: [number, number, number],
    reCall: () => Promise<ColorUtil | undefined>
  ) {
    this.reCall = reCall;
  }
  getHex = () =>
    `#${this.rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
  getRgb = () => `rgb(${this.rgb.join(",")})`;
  getRgbValue = () => this.rgb.join(",");
  parseColorStr = (color: string): [number, number, number] | undefined => {
    const allowSeparator = [",", " ", "，", "-"];
    const separator = allowSeparator.find((v) => color.includes(v));
    if (!separator) {
      console.error("不支持的color字符串");
      return;
    }
    const colorArr = color.split(separator).map((v) => parseInt(v)) as [
      number,
      number,
      number
    ];
    return colorArr;
  };
  is = (
    color: string,
    allowOffsetRange: [number, number, number] = [0, 0, 0]
  ) => {
    const colorArr = this.parseColorStr(color);
    if (!colorArr) {
      return false;
    }
    if (colorArr.length === 3) {
      return this.rgb.every((v, i) => {
        const offset = allowOffsetRange[i];
        return v >= colorArr[i] - offset && v <= colorArr[i] + offset;
      });
    } else {
      console.error("color格式错误");
      return false;
    }
  };
  waitColor = async (
    color: string,
    sleepMs: number = 1000,
    maxWaitCount: number = 10,
    allowOffsetRange: [number, number, number] = [0, 0, 0],
    mismatchCallback?: (curColor: string, expectedColor: string) => void
  ) => {
    if (this.is(color, allowOffsetRange)) {
      return true;
    } else {
      mismatchCallback && mismatchCallback(this.getRgbValue(), color);
    }
    let result = false;
    while (maxWaitCount--) {
      const reCallRes = await this.reCall();
      if (reCallRes && reCallRes.is(color, allowOffsetRange)) {
        result = true;
        break;
      } else {
        reCallRes &&
          mismatchCallback &&
          mismatchCallback(reCallRes.getRgbValue(), color);
      }
      await timeUtil.sleep(sleepMs);
    }
    return result;
  };
  waitNotColor = async (
    color: string,
    sleepMs: number = 1000,
    maxWaitCount: number = 10,
    allowOffsetRange: [number, number, number] = [0, 0, 0]
  ) => {
    if (!this.is(color, allowOffsetRange)) {
      return true;
    }
    let result = false;
    while (maxWaitCount--) {
      const reCallRes = await this.reCall();
      if (reCallRes && !reCallRes.is(color, allowOffsetRange)) {
        result = true;
        break;
      }
      await timeUtil.sleep(sleepMs);
    }
    return result;
  };
}
