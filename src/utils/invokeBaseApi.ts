import { invoke } from "@tauri-apps/api/core";
import { OCRResult } from "../invokes/ocr/exportFn";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useSessionStorageState } from "vue-hooks-plus";

let freeTimer: NodeJS.Timeout | null = null;
const freeAllJson = () => {
  if (IS_PLAYGROUND_ENV) {
    return;
  }
  freeTimer && clearTimeout(freeTimer);
  freeTimer = setTimeout(() => {
    invoke<boolean>("free_all_json_string")
      .then((res) => {
        if (res) {
          console.log("free all json string success");
        } else {
          console.error("free all json string failed");
        }
      })
      .catch((e) => {
        console.error("free all json string error: ", e);
      });
  }, 500);
};

const getScreenSize = async () => {
  if (IS_PLAYGROUND_ENV) {
    return {
      width: 1920,
      height: 1080,
    };
  }
  try {
    const res = await invoke<string>("get_screen_size");
    const jsonRes = JSON.parse(res) as {
      width: number;
      height: number;
    };
    freeAllJson();
    return jsonRes;
  } catch (error) {
    console.error("invokeBaseApi.getScreenSize error: ", error);
    return {
      width: -1,
      height: -1,
    };
  }
};

const getMousePos = async () => {
  if (IS_PLAYGROUND_ENV) {
    return {
      x: Math.floor(Math.random() * 1920),
      y: Math.floor(Math.random() * 1080),
    };
  }
  try {
    const res = await invoke<string>("mouse_get_pos");
    const mousePos = (JSON.parse(res) as any).message as {
      x: number;
      y: number;
    };
    return mousePos;
  } catch (error) {
    console.error("invokeBaseApi.getMousePos error: ", error);
    return {
      x: -1,
      y: -1,
    };
  }
};

const cropPicture = async (
  path: string,
  x: number,
  y: number,
  width: number,
  height: number,
  outPath: string
) => {
  if (IS_PLAYGROUND_ENV) {
    return 1;
  }
  try {
    const res = await invoke<string>("crop_picture", {
      path,
      x,
      y,
      width,
      height,
      outPath,
    });
    const json = JSON.parse(res);
    freeAllJson();
    if (json.code === 200) {
      return 1;
    } else {
      return 0;
    }
  } catch (error) {
    console.error("invokeBaseApi.cropPicture error: ", error);
    return 0;
  }
};

const imgSimilarity = async (
  pathA: string,
  pathB: string,
  x: number = -1,
  y: number = -1,
  width: number = -1,
  height: number = -1
) => {
  if (IS_PLAYGROUND_ENV) {
    return 1;
  }
  try {
    const res = await invoke<number>("get_similarity_value", {
      pathA,
      pathB,
      x,
      y,
      width,
      height,
    });
    return res;
  } catch (error) {
    console.error("invokeBaseApi.imgSimilarity error: ", error);
    return -1;
  }
};

const matchTemplate = async (
  imgPath: string,
  tempPath: string,
  exactValue = 0.0,
  scale = 0.0
) => {
  if (IS_PLAYGROUND_ENV) {
    return {
      x: Math.floor(Math.random() * 1920),
      y: Math.floor(Math.random() * 1080),
    };
  }
  try {
    const res = await invoke<string>("match_template", {
      imgPath,
      tempPath,
      exactValue,
      scale,
    });
    const jsonRes = JSON.parse(res) as {
      x: number;
      y: number;
    };
    freeAllJson();
    return jsonRes;
  } catch (error) {
    console.error("invokeBaseApi.matchTemplate error: ", error);
    return {
      x: -1,
      y: -1,
    };
  }
};

const screenDiffTemplates = async (
  x: number,
  y: number,
  width: number,
  height: number,
  tempPaths: string,
  targetIndex: number
) => {
  if (IS_PLAYGROUND_ENV) {
    return {
      message: "success",
      data: [
        {
          x: Math.floor(Math.random() * 1920),
          y: Math.floor(Math.random() * 1080),
          width: 100,
          height: 100,
          centerX: 50,
          centerY: 50,
          targetOffsetX: 0,
          targetOffsetY: 0,
        },
      ],
    };
  }
  try {
    const res = await invoke<string>("screen_diff_templates", {
      x,
      y,
      width,
      height,
      tempPaths,
      targetIndex,
    });
    const result = JSON.parse(res) as {
      message: string;
      data: {
        x: number;
        y: number;
        width: number;
        height: number;
        centerX: number;
        centerY: number;
        targetOffsetX: number;
        targetOffsetY: number;
      }[];
    };
    freeAllJson();
    return result.data;
  } catch (error) {
    console.error("invokeBaseApi.screenDiffTemplates error: ", error);
    return [];
  }
};

const screenMatchTemplate = async (
  x: number,
  y: number,
  width: number,
  height: number,
  tempPath: string,
  exactValue = 0.0,
  scale = 0.0
) => {
  if (IS_PLAYGROUND_ENV) {
    return {
      x: Math.floor(Math.random() * 1920),
      y: Math.floor(Math.random() * 1080),
    };
  }
  try {
    const res = await invoke<string>("screen_match_template", {
      x,
      y,
      width,
      height,
      tempPath,
      exactValue,
      scale,
    });
    const { x: _x, y: _y } = JSON.parse(res) as {
      x: number;
      y: number;
    };
    freeAllJson();
    return { x: _x, y: _y };
  } catch (error) {
    console.error("invokeBaseApi.screenMatchTemplate error: ", error);
    return { x: -1, y: -1 };
  }
};

const getImgSize = async (path: string) => {
  if (IS_PLAYGROUND_ENV) {
    return {
      width: Math.floor(Math.random() * 1920),
      height: Math.floor(Math.random() * 1080),
    };
  }
  try {
    const res = await invoke<string>("get_img_size", {
      path,
    });
    const jsonRes = JSON.parse(res) as {
      width: number;
      height: number;
    };
    freeAllJson();
    return jsonRes;
  } catch (error) {
    console.error("invokeBaseApi.getImgSize error: ", error);
    return {
      width: -1,
      height: -1,
    };
  }
};

const getImgRectInfo = async (imgPath: string) => {
  if (IS_PLAYGROUND_ENV) {
    return {
      width: Math.floor(Math.random() * 1920),
      height: Math.floor(Math.random() * 1080),
      startX: Math.floor(Math.random() * 1920),
      startY: Math.floor(Math.random() * 1080),
    };
  }
  try {
    const res = await invoke<string>("get_img_rect_info", {
      imgPath,
    });
    const jsonRes = JSON.parse(res);
    freeAllJson();
    return jsonRes as {
      width: number;
      height: number;
      startX: number;
      startY: number;
    };
  } catch (error) {
    console.error("invokeBaseApi.getImgRectInfo error: ", error);
    return {
      width: -1,
      height: -1,
      startX: -1,
      startY: -1,
    };
  }
};

const getScreenRectInfo = async () => {
  if (IS_PLAYGROUND_ENV) {
    return {
      width: Math.floor(Math.random() * 1920),
      height: Math.floor(Math.random() * 1080),
      startX: Math.floor(Math.random() * 1920),
      startY: Math.floor(Math.random() * 1080),
    };
  }
  try {
    const res = JSON.parse(await invoke<string>("get_screen_rect_info"));
    freeAllJson();
    return res as {
      width: number;
      height: number;
      startX: number;
      startY: number;
    };
  } catch (error) {
    console.error("invokeBaseApi.getScreenRectInfo error: ", error);
    return {
      width: -1,
      height: -1,
      startX: -1,
      startY: -1,
    };
  }
};

const combined = async (keys: Key[]) => {
  if (IS_PLAYGROUND_ENV) {
    return true;
  }
  try {
    const res = await invoke<string>("press_keys", {
      keys,
    });
    const json = JSON.parse(res) as {
      code: number;
      message: string;
    };
    if (json.code == 200) {
      return true;
    } else {
      console.error("invokeBaseApi.combined error: ", json);
      return false;
    }
  } catch (error) {
    console.error("invokeBaseApi.combined error: ", error);
    return false;
  }
};

const keyDown = async (key: Key) => {
  if (IS_PLAYGROUND_ENV) {
    return true;
  }
  try {
    const res = await invoke<string>("key_down", {
      key,
    });
    const json = JSON.parse(res) as {
      code: number;
      message: string;
    };
    if (json.code == 200) {
      return true;
    } else {
      console.error("invokeBaseApi.keyDown error: ", json);
      return false;
    }
  } catch (error) {
    console.error("invokeBaseApi.keyDown error: ", error);
    return false;
  }
};

const keyUp = async (key: Key) => {
  if (IS_PLAYGROUND_ENV) {
    return true;
  }
  try {
    const res = await invoke<string>("key_up", {
      key,
    });
    const json = JSON.parse(res) as {
      code: number;
      message: string;
    };
    if (json.code == 200) {
      return true;
    } else {
      console.error("invokeBaseApi.keyUp error: ", json);
      return false;
    }
  } catch (error) {
    console.error("invokeBaseApi.keyUp error: ", error);
    return false;
  }
};

const pressKey = async (key: Key) => {
  if (IS_PLAYGROUND_ENV) {
    return true;
  }
  try {
    const res = await invoke<string>("press_key", {
      key,
    });
    const json = JSON.parse(res) as {
      code: number;
      message: string;
    };
    if (json.code == 200) {
      return true;
    } else {
      console.error("invokeBaseApi.pressKey error: ", json);
      return false;
    }
  } catch (error) {
    console.error("invokeBaseApi.pressKey error: ", error);
    return false;
  }
};

const inputText = async (text: string) => {
  if (IS_PLAYGROUND_ENV) {
    return true;
  }
  try {
    const res = await invoke<string>("input_text", {
      text,
    });
    const json = JSON.parse(res) as {
      code: number;
      message: string;
    };
    if (json.code == 200) {
      return true;
    } else {
      console.error("invokeBaseApi.inputText error: ", json);
      return false;
    }
  } catch (e) {
    console.error("invokeBaseApi.inputText error: ", e);
    return false;
  }
};

const click = async (
  x: number,
  y: number,
  button: "left" | "middle" | "right" = "left"
) => {
  if (IS_PLAYGROUND_ENV) {
    return true;
  }
  x = Math.round(x);
  y = Math.round(y);
  const btn = button === "left" ? 0 : button === "middle" ? 1 : 2;
  try {
    await await invoke("mouse_move_click", {
      x,
      y,
      button: btn,
    });
    return true;
  } catch (e) {
    console.error("invokeBaseApi.click error: ", e);
    return false;
  }
};
const mouseUp = async (
  x: number,
  y: number,
  button: "left" | "middle" | "right" = "left"
) => {
  if (IS_PLAYGROUND_ENV) {
    return true;
  }
  x = Math.round(x);
  y = Math.round(y);
  const btn = button === "left" ? 0 : button === "middle" ? 1 : 2;
  try {
    await await invoke("mouse_move_up", {
      x,
      y,
      button: btn,
    });
    return true;
  } catch (e) {
    console.error("invokeBaseApi.mouseUp error: ", e);
    return false;
  }
};
const mouseDown = async (
  x: number,
  y: number,
  button: "left" | "middle" | "right" = "left"
) => {
  if (IS_PLAYGROUND_ENV) {
    return true;
  }
  x = Math.round(x);
  y = Math.round(y);
  const btn = button === "left" ? 0 : button === "middle" ? 1 : 2;
  try {
    await await invoke("mouse_move_down", {
      x,
      y,
      button: btn,
    });
    return true;
  } catch (e) {
    console.error("invokeBaseApi.mouseDown error: ", e);
    return false;
  }
};
const startClicker = async (
  duration: number,
  sleep: number = 50,
  buttonIndex: number
) => {
  if (IS_PLAYGROUND_ENV) {
    return true;
  }
  try {
    await invoke("start_clicker", {
      duration,
      sleep,
      button: buttonIndex,
    });
    return true;
  } catch (e) {
    console.error("invokeBaseApi.startClicker error: ", e);
    return false;
  }
};
const stopClicker = async () => {
  if (IS_PLAYGROUND_ENV) {
    return true;
  }
  try {
    await invoke("stop_clicker");
    return true;
  } catch (error) {
    console.error("invokeBaseApi.stopClicker error: ", error);
    return false;
  }
};
const drag = async (
  x: number,
  y: number,
  toX: number,
  toY: number,
  duration?: number
) => {
  if (IS_PLAYGROUND_ENV) {
    return true;
  }
  try {
    await invoke("mouse_drag", {
      x,
      y,
      toX,
      toY,
      duration,
    });
    return true;
  } catch (error) {
    console.error("invokeBaseApi.drag error: ", error);
    return false;
  }
};

const move = async (x: number, y: number, isRelative = false) => {
  if (IS_PLAYGROUND_ENV) {
    return true;
  }
  try {
    await invoke("move_mouse", {
      x,
      y,
      relative: isRelative,
    });
    return true;
  } catch (error) {
    console.error("invokeBaseApi.move error: ", error);
    return false;
  }
};

const wheel = async (delta: number) => {
  if (IS_PLAYGROUND_ENV) {
    return true;
  }
  try {
    await invoke("mouse_wheel", {
      delta,
    });
    return true;
  } catch (error) {
    return false;
  }
};

const ocr = async (
  x: number,
  y: number,
  width: number,
  height: number,
  imgPath?: string
) => {
  if (IS_PLAYGROUND_ENV) {
    return {
      code: 1,
      result: [],
    };
  }
  try {
    const ocrRes = await invoke<string>(imgPath ? "ocr" : "screen_ocr", {
      x,
      y,
      width,
      height,
      imgPath,
    });
    const resObject = JSON.parse(ocrRes) as {
      code: number;
      result: OCRResult[];
    };
    return resObject;
  } catch (error) {
    console.error("invokeBaseApi.ocr error: ", error);
    return null;
  }
};

const screenColor = async (x: number = 0, y: number = 0) => {
  if (IS_PLAYGROUND_ENV) {
    return {
      message: "success",
      data: [
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
      ] as [number, number, number],
    };
  }
  try {
    const res = await invoke<string>("screen_color", {
      x,
      y,
    });
    const json = JSON.parse(res) as {
      message: string;
      data: [number, number, number];
    };
    freeAllJson();
    return json;
  } catch (error) {
    console.error("invokeBaseApi.screenColor error: ", error);
    return {
      message: "invokeBaseApi.screenColor error: " + error,
      data: [-1, -1, -1] as [number, number, number],
    };
  }
};
const imgColor = async (path: string, x: number, y: number) => {
  if (IS_PLAYGROUND_ENV) {
    return {
      message: "success",
      data: [
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
      ] as const,
    };
  }
  try {
    const res = await invoke<string>("img_color", {
      path,
      x,
      y,
    });
    const json = JSON.parse(res) as {
      message: string;
      data: [number, number, number];
    };
    freeAllJson();
    return json;
  } catch (error) {
    console.error("invokeBaseApi.img_color error: ", error);
    return {
      message: "invokeBaseApi.img_color error: " + error,
      data: [-1, -1, -1],
    };
  }
};
const screenshot = async (
  path: string,
  x = -1,
  y = -1,
  width = -1,
  height = -1
) => {
  if (IS_PLAYGROUND_ENV) {
    return true;
  }
  if (path === "") {
    return false;
  }
  try {
    const res = await invoke<string>("screenshot", {
      x,
      y,
      w: width,
      h: height,
      path,
    });
    const json = JSON.parse(res);
    freeAllJson();
    if (json.code !== 200) {
      console.error("invokeBaseApi.screenshotError: ", json);
      return false;
    }
    return true;
  } catch (error) {
    console.error("invokeBaseApi.screenshot error: ", error);
    return false;
  }
};

const captureOperation = async (
  captureOptions?: CaptureOptions,
  generateComment: boolean = false
): Promise<string> => {
  if (IS_PLAYGROUND_ENV) {
    return "//playground环境不支持此功能";
  }
  try {
    const res = await invoke<string[]>("capture_operation", {
      captureOptions,
      generateComment,
    });
    return res.join("\n");
  } catch (error) {
    console.error("invokeBaseApi.captureOperation error: ", error);
    return "";
  }
};

const stopCaptureOperation = async () => {
  if (IS_PLAYGROUND_ENV) {
    return true;
  }
  try {
    await invoke("qiut_capture_operation");
    return true;
  } catch (error) {
    console.error("invokeBaseApi.stopCaptureOperation error: ", error);
    return false;
  }
};

const getSparkInfo = async () => {
  if (IS_PLAYGROUND_ENV) {
    return {
      APP_ID: "playground",
      API_SECRET: "playground",
      API_KEY: "playground",
    };
  }
  try {
    const res = await invoke<string>("get_spark_info");
    const info = res.split("-") as [string, string, string];
    return {
      APP_ID: info[0],
      API_SECRET: info[1],
      API_KEY: info[2],
    };
  } catch (e) {
    console.error("invokeBaseApi.getSparkInfo error: ", e);
    return {
      APP_ID: "",
      API_SECRET: "",
      API_KEY: "",
    };
  }
};
const [closeFlag, setCloseFlag] = useSessionStorageState<boolean>(
  "CLOSE_SPLASHSCREEN_FLAG",
  { defaultValue: false }
);
const closeSplashscreen = async () => {
  if (IS_PLAYGROUND_ENV || closeFlag.value) {
    return;
  }
  try {
    const appWindow = getCurrentWebviewWindow();
    await invoke("close_splashscreen");
    await appWindow.setFocus();
    setCloseFlag(true);
  } catch (error) {
    console.error("invokeBaseApi.closeSplashscreen error: ", error);
  }
};

export const invokeBaseApi = {
  captureOperation,
  stopCaptureOperation,
  getScreenSize,
  getMousePos,
  cropPicture,
  imgSimilarity,
  matchTemplate,
  screenDiffTemplates,
  screenMatchTemplate,
  getImgSize,
  getImgRectInfo,
  getScreenRectInfo,
  combined,
  keyDown,
  keyUp,
  pressKey,
  inputText,
  click,
  mouseDown,
  mouseUp,
  startClicker,
  stopClicker,
  drag,
  move,
  wheel,
  ocr,
  screenColor,
  screenshot,
  imgColor,
  getSparkInfo,
  closeSplashscreen,
};
