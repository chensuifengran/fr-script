export const declaration = `
declare function screenshotColor(
    x:number,
    y:number,
    mod?:'normal'|'adb'
):Promise<ColorUtil | undefined>;
`;
