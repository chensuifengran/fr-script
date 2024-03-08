export const declaration = `
function listen(
  keys:string[],
  handler:(key:string)=>void,
):Promise<(() => Promise<void>) | undefined>;
`