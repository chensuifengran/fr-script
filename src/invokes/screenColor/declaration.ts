export const declaration = `
declare class ColorUtil {
    public rgb: [number, number, number];
    private reCall: () => Promise<ColorUtil | undefined>;
    constructor(
      rgb: [number, number, number],
      reCall: () => Promise<ColorUtil | undefined>
    );
    getHex: () => string;
    getRgb: () => string;
    getRgbValue: () => string;
    parseColorStr: (color: string) => [number, number, number] | undefined;
    is: (color: string) => boolean;
    waitColor: (
      color: string,
      sleepMs?: number,
      maxWaitCount?: number
    ) => Promise<boolean>;
}
declare function screenColor(
    x?:number,
    y?:number,
):Promise<ColorUtil | undefined>;
`;
