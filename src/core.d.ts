/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// noinspection JSUnusedGlobalSymbols
// Generated by /script/genBuiltInApiType.js
export {};
declare global {
  interface Window {
    __FR_BUILT_IN_API__: {
      adbScreenshot: typeof import("./invokes/adbScreenshot/exportFn")["adbScreenshotFn"];
      adbState: typeof import("./invokes/adbState/exportFn")["adbStateFn"];
      clickHomeKey: typeof import("./invokes/clickHomeKey/exportFn")["clickHomeKeyFn"];
      clickReturnKey: typeof import("./invokes/clickReturnKey/exportFn")["clickReturnKeyFn"];
      cmd: typeof import("./invokes/cmd/exportFn")["cmdFn"];
      connectTo: typeof import("./invokes/connectTo/exportFn")["connectToFn"];
      cropPicture: typeof import("./invokes/cropPicture/exportFn")["cropPictureFn"];
      CV: {
        __NS_DATA__: Record<string, any>;
        imgSimilarity: typeof import("./invokes/CV/imgSimilarity/exportFn")["imgSimilarityFn"];
        matchTemplate: typeof import("./invokes/CV/matchTemplate/exportFn")["matchTemplateFn"];
        screenDiffTemplates: typeof import("./invokes/CV/screenDiffTemplates/exportFn")["screenDiffTemplatesFn"];
        screenMatchTemplate: typeof import("./invokes/CV/screenMatchTemplate/exportFn")["screenMatchTemplateFn"];
      };
      devices: typeof import("./invokes/devices/exportFn")["devicesFn"];
      disConnectTo: typeof import("./invokes/disConnectTo/exportFn")["disConnectToFn"];
      getImageSize: typeof import("./invokes/getImageSize/exportFn")["getImageSizeFn"];
      getImgRectInfo: typeof import("./invokes/getImgRectInfo/exportFn")["getImgRectInfoFn"];
      getScreenRectInfo: typeof import("./invokes/getScreenRectInfo/exportFn")["getScreenRectInfoFn"];
      getScreenSize: typeof import("./invokes/getScreenSize/exportFn")["getScreenSizeFn"];
      GlobalShortcut: {
        __NS_DATA__: Record<string, any>;
        listen: typeof import("./invokes/GlobalShortcut/listen/exportFn")["listenFn"];
        unlisten: typeof import("./invokes/GlobalShortcut/unlisten/exportFn")["unlistenFn"];
        waitKeys: typeof import("./invokes/GlobalShortcut/waitKeys/exportFn")["waitKeysFn"];
      };
      Input: {
        __NS_DATA__: Record<string, any>;
        combined: typeof import("./invokes/Input/combined/exportFn")["combinedFn"];
        keyDown: typeof import("./invokes/Input/keyDown/exportFn")["keyDownFn"];
        keyUp: typeof import("./invokes/Input/keyUp/exportFn")["keyUpFn"];
        press: typeof import("./invokes/Input/press/exportFn")["pressFn"];
        text: typeof import("./invokes/Input/text/exportFn")["textFn"];
      };
      Mouse: {
        __NS_DATA__: Record<string, any>;
        click: typeof import("./invokes/Mouse/click/exportFn")["clickFn"];
        clicker: typeof import("./invokes/Mouse/clicker/exportFn")["clickerFn"];
        down: typeof import("./invokes/Mouse/down/exportFn")["downFn"];
        drag: typeof import("./invokes/Mouse/drag/exportFn")["dragFn"];
        move: typeof import("./invokes/Mouse/move/exportFn")["moveFn"];
        pos: typeof import("./invokes/Mouse/pos/exportFn")["posFn"];
        randomMove: typeof import("./invokes/Mouse/randomMove/exportFn")["randomMoveFn"];
        setMouseOption: typeof import("./invokes/Mouse/setMouseOption/exportFn")["setMouseOptionFn"];
        up: typeof import("./invokes/Mouse/up/exportFn")["upFn"];
        wheel: typeof import("./invokes/Mouse/wheel/exportFn")["wheelFn"];
      };
      ocr: typeof import("./invokes/ocr/exportFn")["ocrFn"];
      Preludes: {
        __NS_DATA__: Record<string, any>;
        log: typeof import("./invokes/Preludes/log/exportFn")["logFn"];
        sleep: typeof import("./invokes/Preludes/sleep/exportFn")["sleepFn"];
      };
      screenColor: typeof import("./invokes/screenColor/exportFn")["screenColorFn"];
      screenshot: typeof import("./invokes/screenshot/exportFn")["screenshotFn"];
      screenshotColor: typeof import("./invokes/screenshotColor/exportFn")["screenshotColorFn"];
      slideTo: typeof import("./invokes/slideTo/exportFn")["slideToFn"];
      touch: typeof import("./invokes/touch/exportFn")["touchFn"];
    } & ReturnType<typeof import("./hooks/useScriptApi")["useBuiltInApi"]>;
  }
}
  