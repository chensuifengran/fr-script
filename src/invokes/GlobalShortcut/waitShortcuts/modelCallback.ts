import { auxiliary } from "./auxiliary";
import { waitShortcutsFn } from "./exportFn";

export const modelCallback = async (
  options: {
    shortcuts: string[];
    delay: number;
    replaceCurFnArgs?: (targetArgs: string) => void;
  },
  testModuleCtx: {
    showDetails: (text: string | undefined, preStr?: string) => void;
  }
) => {
  if (options.replaceCurFnArgs) {
    const res = auxiliary.parameterReplace(options);
    AutoTipUtils.apiAutoTip();
    return res;
  }
  if (options.delay > 0) {
    await new Promise((resolve) => {
      const t = setTimeout(() => {
        resolve(null);
        clearTimeout(t);
      }, options.delay);
    });
  }
  console.time("waitShortcuts耗时");
  const res = await waitShortcutsFn(options.shortcuts);
  console.timeEnd("waitShortcuts耗时");
  testModuleCtx.showDetails(JSON.stringify(res), "waitShortcuts");
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "waitShortcuts" && i.scope === "GlobalShortcut"
  )?.testModule!;
  selfModule.document!.example!.code = `await Input.waitShortcuts([${options.shortcuts
    .map((key) => `"${key}"`)
    .join(", ")}]);`;
};