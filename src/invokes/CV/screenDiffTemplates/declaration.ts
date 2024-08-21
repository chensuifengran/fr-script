export const declaration = `
function screenDiffTemplates(
    x:number,
    y:number,
    width: number,
    height: number,
    tempPaths: string[],
    targetIndex?: number
):Promise<{
    x:number;
    y:number;
    width:number;
    height:number;
    centerX:number;
    centerY:number;
    targetOffsetX:number;
    targetOffsetY:number;
}[] | undefined>;`;
