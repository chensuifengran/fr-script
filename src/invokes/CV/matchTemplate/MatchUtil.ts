import { clickFn } from "../../Mouse/click/exportFn";
import { touchFn } from "../../touch/exportFn";

export class MatchUtil {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public async click() {
    await clickFn(this.x, this.y);
  }

  public async touch() {
    return await touchFn(this.x, this.y);
  }
}