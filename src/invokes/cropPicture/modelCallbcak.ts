import { auxiliary } from "./auxiliary";
import { cropPictureFn } from "./exportFn";
const { getInvokeApiMethods } = useInvokeApiMethodsRegister();

export const modelCallback = async (
  options: {
    path: string;
    range: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    outPath: string;
    replaceCurFnArgs?: (targetArgs: string) => void;
  },
  testModuleCtx: {
    showDetails: (text: string | undefined, preStr?: string) => void;
  }
) => {
  if (options.replaceCurFnArgs) {
    return auxiliary.parameterReplace(options);
  }
  console.time("cropPicture耗时");
  const res = await cropPictureFn(
    options.path,
    options.range.x,
    options.range.y,
    options.range.width,
    options.range.height,
    options.outPath
  );
  console.timeEnd("cropPicture耗时");
  if (res) {
    testModuleCtx.showDetails(`裁剪图片完成`, "cropPicture");
  } else {
    testModuleCtx.showDetails(`裁剪图片失败`, "cropPicture");
  }
  const selfModule = getInvokeApiMethods().find(
    (i) => i.name === "cropPicture"
  )?.testModule;
  selfModule!.document!.example!.code = codeHighLight(
    `const res = await cropPicture(
        \t"${options.path.replace(/\\/g, "\\\\")}",
        \t${options.range.x},
        \t${options.range.y},
        \t${options.range.width},
        \t${options.range.height},
        \t"${options.outPath.replace(/\\/g, "\\\\")}",
      )`
  );
};
