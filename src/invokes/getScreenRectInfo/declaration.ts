export const declaration = `
declare function getScreenRectInfo(
    delayTime?:number
):Promise<{ startX:number; startY:number; width:number; height:number; }>;
`