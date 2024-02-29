export const declaration = `
function matchTemplate(
    imgPath: string,
    tempPath: string,
    exactValue?: number,
    scale?:number
):Promise<{x:number,y:number}>;
`