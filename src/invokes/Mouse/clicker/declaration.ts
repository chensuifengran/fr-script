export const declaration = `
function clicker(
  duration: number,
  sleep?: number,
  button?: 'left' | 'right' | 'middle',
):Promise<() => Promise<void>>;
`;
