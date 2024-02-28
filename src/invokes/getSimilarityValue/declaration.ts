export const declaration = `
declare function getSimilarityValue(
    pathA:string,
    pathB:string,
    x?: number,
    y?: number,
    width?: number,
    height?: number
):Promise<number>;
`