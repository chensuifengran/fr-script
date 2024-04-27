import { WebviewWindow, WindowOptions } from "@tauri-apps/api/window";

export const useWebviewWindow = () => {
  const webview = ref<WebviewWindow | null>(null);
  const createWindow = (
    label: string,
    routePath: string,
    options?: WindowOptions
  ) => {
    try {
      const globalTarget = WebviewWindow.getByLabel(label);
      const defaultOps = {
        fullscreen: false,
        resizable: true,
        title: label,
        decorations: false,
        transparent: true,
        width: 800,
        height: 600,
        minWidth: 800,
        fileDropEnabled: false
      };
      if (!globalTarget) {
        if (!options) {
          options = defaultOps;
        } else {
          options = {
            ...defaultOps,
            ...options,
          };
        }
        const urlPath = `./index.html/#${routePath}`;
        const url = new URL(urlPath, import.meta.url).href;
        const window = new WebviewWindow(label, {
          ...options,
          url,
        });
        webview.value = window;

        return window;
      } else {
        return globalTarget;
      }
    } catch (error) {
      console.error("useWebviewWindow error", error);
      return null;
    }
  };
  return {
    webview,
    createWindow,
  };
};
