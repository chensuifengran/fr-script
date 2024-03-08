import { auxiliary } from "./auxiliary";
import { waitKeysFn } from "./exportFn";
const { getInvokeApiMethods } = useInvokeApiMethodsRegister();

export const modelCallback = async (
  options: {
    keys: string[];
    delay: number;
    replaceCurFnArgs?: (targetArgs: string) => void;
  },
  testModuleCtx: {
    showDetails: (text: string | undefined, preStr?: string) => void;
  }
) => {
  if (options.replaceCurFnArgs) {
    return auxiliary.parameterReplace(options);
  }
  if (options.delay > 0) {
    await new Promise((resolve) => {
      const t = setTimeout(() => {
        resolve(null);
        clearTimeout(t);
      }, options.delay);
    });
  }
  console.time("waitKeys耗时");
  const res = await waitKeysFn(options.keys);
  console.timeEnd("waitKeys耗时");
  testModuleCtx.showDetails(JSON.stringify(res), "waitKeys");
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "waitKeys" && i.scope === "GlobalShortcut"
  )?.testModule!;
  selfModule.document!.example!.code = codeHighLight(
    `await Input.waitKeys([${options.keys.map(key=>`"${key}"`).join(", ")}]);`
  );
};
