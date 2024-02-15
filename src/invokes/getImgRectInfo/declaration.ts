export const declaration = `
declare function getImgRectInfo(
    imgPath: string
):Promise<{ startX:number; startY:number; width:number; height:number; }>;
`