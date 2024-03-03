import { auxiliary } from "./auxiliary";
import { screenshotFn } from "./exportFn";
const { getInvokeApiMethods } = useInvokeApiMethodsRegister();

export const modelCallback = async (
  options: {
    path: string;
    selectRange: boolean;
    range: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
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
    await new Promise<void>((resolve) => setTimeout(resolve, options.delay));
  }
  console.time("screenshot耗时");
  if (options.selectRange === false) {
    options.range = {
      x: -1,
      y: -1,
      width: -1,
      height: -1,
    };
  }
  await screenshotFn(
    options.range.x,
    options.range.y,
    options.range.width,
    options.range.height,
    options.path
  );
  console.timeEnd("screenshot耗时");
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "screenshot"
  )?.testModule;
  const appGSStore = useAppGlobalSettings();
  const equalPath = appGSStore.envSetting.screenshotSavePath === options.path || options.path === "";
  
  if (options.selectRange) {
    selfModule!.document!.example!.code = codeHighLight(
      `const res = await screenshot(
            \t${options.range.x},
            \t${options.range.y},
            \t${options.range.width},
            \t${options.range.height}${
        equalPath ? "" : `, "${options.path.replace(/\\/g, "\\\\")}"`
      });`
    );
  } else {
    selfModule!.document!.example!.code = codeHighLight(
      `const res = await screenshot(${
        equalPath ? "" : `, "${options.path.replace(/\\/g, "\\\\")}"`
      });`
    );
  }
  testModuleCtx.showDetails(`截图完成`, "screenshot");
};