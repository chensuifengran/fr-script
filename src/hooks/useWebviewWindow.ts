import { WebviewWindow, WindowOptions } from "@tauri-apps/api/window";
import { GlobalWindowInfo } from "../types/webviewWindow";

const globalWindowInfo = ref<GlobalWindowInfo>({
  windows: [],
});

export const useWebviewWindow = () => {
  const webview = ref<WebviewWindow | null>(null);
  const createWindow = (
    label: string,
    routePath: string,
    options?: WindowOptions
  ) => {
    const globalTarget = globalWindowInfo.value.windows.find((item) => {
      return item.label === label;
    });
    if (!globalTarget) {
      if (!options) {
        options = {
          fullscreen:false,
          resizable: true,
          title: label,
          decorations: false,
          transparent: true,
          width: 800,
          height: 600,
          minWidth: 800,
        };
      }
      const urlPath = `./index.html/#${routePath}`;
      const url = new URL(urlPath, import.meta.url).href;
      const window = new WebviewWindow(label, {
        ...options,
        url,
      });
      webview.value = window;
      globalWindowInfo.value.windows.push({
        label,
        window,
      });
      return window;
    } else {
      return globalTarget.window;
    }
  };
  return {
    globalWindowInfo,
    webview,
    createWindow,
  };
};
