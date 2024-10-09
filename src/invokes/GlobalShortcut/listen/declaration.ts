export const declaration = `
type ShortcutEvent = {
  shortcut: string;
  id: number;
  state: 'Released' | 'Pressed';
}
type ShortcutHandler = (event: ShortcutEvent) => void;
function listen(
  shortcuts: string | string[],
  handler: ShortcutHandler,
):Promise<(() => Promise<void>) | undefined>;
`