import { clickFn } from "../Mouse/click/exportFn";
import { touchFn } from "../touch/exportFn";
import { OCRResult } from "./exportFn";
const sleep = (ms: number) => {
  return new Promise<void>((resolve) => {
    const t = setTimeout(()=>{
      clearTimeout(t);
      resolve();
    }, ms);
  })
};

class FindResult {
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
  constructor(originX: number, originY: number, result: OCRResult[], reCall:() => Promise<OcrUtil | undefined>) {
    this.result = result;
    this.ori = {
      x: originX,
      y: originY,
    };
    this.reCall = reCall;
  }
  public includes(texts: string[]) {
    return !!this.result.find((i) => {
      for (const text of texts) {
        if (i.text === text || i.text.includes(text)) {
          return true;
        }
      }
    });
  }
  public findText(text: string, offset?: [number, number]) {
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
    return null;
  }
  public async waitText(text: string, sleepMs:number = 1000, maxWaitCount:number = 10) {
    let result = false;
    while(maxWaitCount--){
      const reCallRes = await this.reCall();
      if(reCallRes && reCallRes.includes([text])){
        result = true;
        break;
      }
      await sleep(sleepMs);
    }
    return result;
  }
}
