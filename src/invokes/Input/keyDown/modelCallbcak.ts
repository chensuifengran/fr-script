import { auxiliary } from "./auxiliary";
import { keyDownFn } from "./exportFn";
const { getInvokeApiMethods } = useInvokeApiMethodsRegister();

export const modelCallback = async (
  options: {
    key: Key;
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
  console.time("keyDown耗时");
  const res = await keyDownFn(options.key);
  console.timeEnd("keyDown耗时");
  testModuleCtx.showDetails(JSON.stringify(res), "keyDown");
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "keyDown" && i.scope === "Input"
  )?.testModule!;
  selfModule.document!.example!.code = codeHighLight(
    `await Input.keyDown('${options.key}');`
  );
};