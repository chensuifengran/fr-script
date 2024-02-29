export const declaration = `
function screenMatchTemplate(
    x:number,
    y:number,
    width:number,
    height:number,
    tempPath: string,
    exactValue?:number,
    scale?:number,
    drive?:string
):Promise<{x:number,y:number}>;
`