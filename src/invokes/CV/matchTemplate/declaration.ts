export const declaration = `
class MatchUtil {
    x:number;
    y:number;
    constructor(x: number, y: number);
    public click(): Promise<void>;
    public touch(): Promise<string>;
}
function matchTemplate(
    imgPath: string,
    tempPath: string,
    exactValue?: number,
    scale?:number
):Promise<MatchUtil | undefined>;
`;
