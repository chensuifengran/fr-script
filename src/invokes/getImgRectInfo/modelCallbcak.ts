import { auxiliary } from "./auxiliary";
import { getImgRectInfoFn } from "./exportFn";

export const modelCallback = async (
  options: { imgPath: string; replaceCurFnArgs?: (targetArgs: string) => void },
  testModuleCtx: {
    showDetails: ShowDetailsFn;
  }
) => {
  if (options.replaceCurFnArgs) {
    const res = auxiliary.parameterReplace(options);
    AutoTipUtils.apiAutoTip();
    return res;
  }
  //判断options.imgPath格式是否正确
  const ext = options.imgPath.split(".").pop();
  if (!["png", "jpg", "jpeg", "webp", "bmp"].includes(ext!)) {
    return testModuleCtx.showDetails("不支持的格式。", "getImgRectInfo");
  }
  console.time("getImgRectInfo耗时");
  const rectInfo = await getImgRectInfoFn(options.imgPath);
  console.timeEnd("getImgRectInfo耗时");
  const selfFnModule = getInvokeApiMethods().find(
    (i) => i.name === "getImgRectInfo"
  )?.testModule;
  selfFnModule!.document!.example!.code = `const { startX, startY, width, height } = 
            \tawait getImgRectInfo("${options.imgPath.replace(
              /\\/g,
              "\\\\"
            )}");`;
  testModuleCtx.showDetails(
    `当前图片标注矩形的起始点以及宽高：${JSON.stringify(rectInfo)}`,
    "getImgRectInfo"
  );
};
