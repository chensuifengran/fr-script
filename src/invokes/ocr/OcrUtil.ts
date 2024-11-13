import { timeUtil } from "../../utils/timeUtil";
import { clickFn } from "../Mouse/click/exportFn";
import { adbScreenshotFn } from "../adbScreenshot/exportFn";
import { touchFn } from "../touch/exportFn";
import { OCRResult } from "./exportFn";

export class FindResult {
  centerPos: [number, number];
  text: string;
  score: number;
  constructor(
    position: OCRResult["position"],
    text: string,
    score: number,
    offset?: [number, number]
  ) {
    this.text = text;
    this.score = score;
    //计算中心点
    let x = (position[0][0] + position[2][0]) / 2;
    let y = (position[0][1] + position[2][1]) / 2;
    if (offset) {
      x += offset[0];
      y += offset[1];
    }
    this.centerPos = [x, y];
  }
  public async click() {
    await clickFn(this.centerPos[0], this.centerPos[1]);
  }
  public async touch() {
    return await touchFn(this.centerPos[0], this.centerPos[1]);
  }
}
export class OcrUtil {
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
  ) {
    this.result = result;
    this.ori = {
      x: originX,
      y: originY,
    };
    this.reCall = reCall;
  }
  includes = (texts: string[]) => {
    return !!this.result.find((i) => {
      for (const text of texts) {
        if (i.text === text || i.text.includes(text)) {
          return true;
        }
      }
    });
  };
  findText = (text: string, offset?: [number, number]) => {
    const target = this.result.find(
      (i) => i.text === text || i.text.includes(text)
    );
    if (target) {
      return new FindResult(
        target.position.map((item) => [
          item[0] + this.ori.x,
          item[1] + this.ori.y,
        ]) as OCRResult["position"],
        target.text,
        target.score,
        offset
      );
    }
  };
  searchText = (text: string, offset?: [number, number]) => {
    const targets = this.result.filter(
      (i) => i.text === text || i.text.includes(text)
    );
    return targets.map(
      (target) =>
        new FindResult(
          target.position.map((item) => [
            item[0] + this.ori.x,
            item[1] + this.ori.y,
          ]) as OCRResult["position"],
          target.text,
          target.score,
          offset
        )
    );
  };
  waitText = async (
    text: string,
    adb = false,
    sleepMs: number = 1000,
    maxWaitCount: number = 10,
    mismatchCallback?: (curText: OCRResult[], expectText: string) => void
  ) => {
    if (this.findText(text)) {
      return true;
    } else {
      mismatchCallback && mismatchCallback(this.result, text);
    }
    let result = false;
    while (maxWaitCount--) {
      if (adb) {
        await adbScreenshotFn();
      }
      const reCallRes = await this.reCall();
      if (reCallRes && reCallRes.includes([text])) {
        result = true;
        break;
      } else {
        reCallRes && mismatchCallback && mismatchCallback(this.result, text);
      }
      await timeUtil.sleep(sleepMs);
    }
    return result;
  };
}
